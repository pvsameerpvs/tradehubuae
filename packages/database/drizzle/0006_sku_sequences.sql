CREATE TABLE IF NOT EXISTS "catalog"."sku_sequences" (
	"prefix" varchar(20) PRIMARY KEY NOT NULL,
	"last_num" integer DEFAULT 0 NOT NULL
);
