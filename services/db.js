const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSLMODE === "require"
        ? { rejectUnauthorized: false }
        : undefined,
      max: Number(process.env.PG_POOL_MAX || 5),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    })
  : null;

const IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

function safeIdentifier(value) {
  if (!IDENTIFIER.test(value)) {
    throw new Error("Invalid SQL identifier.");
  }
  return `"${value}"`;
}

class Query {
  constructor(table) {
    this.table = safeIdentifier(table);
    this.action = "select";
    this.columns = "*";
    this.values = [];
    this.filters = [];
    this.sort = [];
    this.maxRows = null;
    this.payload = null;
    this.returning = false;
    this.mode = null;
  }

  select(columns = "*") {
    this.columns = columns.trim() === "*"
      ? "*"
      : columns.split(",").map(x => x.trim())
          .map(safeIdentifier).join(", ");

    if (this.action !== "select") this.returning = true;
    return this;
  }

  eq(column, value) {
    this.filters.push({
      column: safeIdentifier(column),
      value
    });
    return this;
  }

  order(column, options = {}) {
    this.sort.push(
      `${safeIdentifier(column)} ${options.ascending === false ? "DESC" : "ASC"}`
    );
    return this;
  }

  limit(count) {
    const n = Number(count);
    if (!Number.isInteger(n) || n < 0 || n > 1000) {
      throw new Error("Invalid query limit.");
    }
    this.maxRows = n;
    return this;
  }

  insert(payload) {
    this.action = "insert";
    this.payload = payload;
    return this;
  }

  update(payload) {
    this.action = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.action = "delete";
    return this;
  }

  single() {
    this.mode = "single";
    return this.execute();
  }

  maybeSingle() {
    this.mode = "maybeSingle";
    return this.execute();
  }

  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }

  async execute() {
    if (!pool) {
      return {
        data: null,
        error: Object.assign(
          new Error("Database is not configured. Set DATABASE_URL."),
          { status: 503 }
        )
      };
    }

    try {
      const params = [];

      const where = this.filters.map(({ column, value }) => {
        params.push(value);
        return `${column} = $${params.length}`;
      });

      const whereSql = where.length
        ? " WHERE " + where.join(" AND ")
        : "";

      let sql;

      if (this.action === "select") {
        sql = `SELECT ${this.columns} FROM ${this.table}${whereSql}`;

        if (this.sort.length) {
          sql += " ORDER BY " + this.sort.join(", ");
        }

        if (this.maxRows !== null) {
          sql += ` LIMIT ${this.maxRows}`;
        }

      } else if (this.action === "insert") {
        const entries = Object.entries(this.payload || {});

        if (!entries.length) {
          throw new Error("No fields provided for insert.");
        }

        const cols = entries.map(([key]) => safeIdentifier(key));

        const placeholders = entries.map(([, value]) => {
          params.push(value);
          return `$${params.length}`;
        });

        sql = `INSERT INTO ${this.table} (${cols.join(", ")}) VALUES (${placeholders.join(", ")})`;

        if (this.returning) {
          sql += ` RETURNING ${this.columns}`;
        }

      } else if (this.action === "update") {
        const entries = Object.entries(this.payload || {});

        if (!entries.length) {
          throw new Error("No fields provided for update.");
        }

        const sets = entries.map(([key, value]) => {
          params.push(value);
          return `${safeIdentifier(key)} = $${params.length}`;
        });

        sql = `UPDATE ${this.table} SET ${sets.join(", ")}${whereSql}`;

        if (this.returning) {
          sql += ` RETURNING ${this.columns}`;
        }

      } else {
        sql = `DELETE FROM ${this.table}${whereSql}`;
      }

      const result = await pool.query(sql, params);
      const rows = result.rows || [];

      if (this.mode === "single") {
        if (rows.length !== 1) {
          throw Object.assign(
            new Error(rows.length ? "Expected one row, received multiple rows." : "No row found."),
            { status: 404 }
          );
        }
        return { data: rows[0], error: null };
      }

      if (this.mode === "maybeSingle") {
        if (rows.length > 1) {
          throw new Error("Expected zero or one row, received multiple rows.");
        }
        return { data: rows[0] || null, error: null };
      }

      return {
        data: this.action === "delete" ? null : rows,
        error: null
      };

    } catch (error) {
      return { data: null, error };
    }
  }
}

const db = {
  from(table) {
    return new Query(table);
  }
};

function requireDb() {
  if (!pool) {
    throw Object.assign(
      new Error("Database is not configured. Set DATABASE_URL."),
      { status: 503 }
    );
  }
  return db;
}

async function initializeDatabase() {
  if (!pool) {
    throw Object.assign(
      new Error("DATABASE_URL is not configured."),
      { status: 503 }
    );
  }

  const schemaPath = path.join(
    __dirname,
    "..",
    "database",
    "schema.sql"
  );

  const schema = fs.readFileSync(schemaPath, "utf8");

  await pool.query(schema);
  await pool.query("SELECT 1");
}

async function checkDb() {
  if (!pool) return false;
  await pool.query("SELECT 1");
  return true;
}

module.exports = {
  db,
  pool,
  requireDb,
  checkDb,
  initializeDatabase
};
