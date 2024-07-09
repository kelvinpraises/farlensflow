// utils/swapIntentsHelpers.ts
import { db } from "@/db";

export interface SwapIntentParams {
  limit?: number;
  offset?: number;
  status?: string;
}

export async function getSwapIntents({
  limit = 10,
  offset = 0,
  status,
}: SwapIntentParams = {}) {
  try {
    let query = db
      .selectFrom("starklens.swap_intents")
      .selectAll()
      .limit(limit)
      .offset(offset);

    if (status) {
      query = query.where("status", "=", status);
    }

    const swapIntents = await query.execute();

    // Transform the database result to match the SwapIntent type
    return swapIntents.map((intent) => ({
      id: intent.id,
      creator: intent.creator,
      status: intent.status,
      created_at: parseFloat(intent.created_at),
      updated_at: parseFloat(intent.updated_at),
      from: {
        address: intent.from_address,
        ticker: intent.from_ticker,
        amount: parseFloat(intent.from_amount),
      },
      to: {
        address: intent.to_address,
        ticker: intent.to_ticker,
        amount: parseFloat(intent.to_amount),
      },
      rate: parseFloat(intent.rate),
      gated: {
        account: intent.gated_account
          ? { address: intent.gated_account }
          : undefined,
        in_collection: intent.gated_in_collection
          ? { address: intent.gated_in_collection }
          : undefined,
        min_balance:
          intent.gated_min_balance_address && intent.gated_min_balance_amount
            ? {
                address: intent.gated_min_balance_address,
                amount: parseFloat(intent.gated_min_balance_amount),
              }
            : undefined,
        token_id:
          intent.gated_token_id_address && intent.gated_token_id
            ? {
                address: intent.gated_token_id_address,
                id: parseFloat(intent.gated_token_id),
              }
            : undefined,
      },
      notes: intent.notes ?? undefined,
    }));
  } catch (error) {
    console.error("Error fetching swap intents:", error);
    throw new Error("Failed to fetch swap intents");
  }
}

export async function getMetrics() {
  try {
    const [intentVolume, intentsTransmitted, activeSwaps] = await Promise.all([
      db
        .selectFrom("starklens.swap_intents")
        .select(({ fn }) => [fn.sum("from_amount").as("total_volume")])
        .executeTakeFirst(),
      db
        .selectFrom("starklens.swap_intents")
        .select(({ fn }) => [fn.count("id").as("count")])
        .executeTakeFirst(),
      db
        .selectFrom("starklens.swap_intents")
        .select(({ fn }) => [fn.count("id").as("count")])
        .where("status", "=", "Open")
        .executeTakeFirst(),
    ]);

    return [
      {
        title: "Intent volume",
        value: `$${Number(intentVolume?.total_volume || 0).toFixed(2)}`,
      },
      {
        title: "Intents Transmitted",
        value: intentsTransmitted?.count.toString() || "0",
      },
      { title: "Active Swaps", value: activeSwaps?.count.toString() || "0" },
    ];
  } catch (error) {
    console.error("Error fetching metrics:", error);
    throw new Error("Failed to fetch metrics");
  }
}

export async function getAssets() {
  try {
    const assets = await db
      .selectFrom("starklens.swap_intents")
      .select([
        "from_address as address",
        "from_ticker as symbol",
        ({ fn }) => fn.sum("from_amount").as("tvl_amount"),
        ({ fn }) => fn.sum("from_amount").as("volume_amount"),
      ])
      .groupBy(["from_address", "from_ticker"])
      .execute();

    return assets.map((asset) => ({
      name: asset.symbol, // TODO: fetch the full name
      symbol: asset.symbol,
      iconUrl: `/tokens/${asset.symbol.toLowerCase()}.svg`, // TODO: add a case where these icons are missing
      tvl: {
        amount: asset.tvl_amount.toString(),
        usdValue: `$${Number(asset.tvl_amount).toFixed(2)}`, // fetch actual USD values
      },
      volume: {
        amount: asset.volume_amount.toString(),
        usdValue: `$${Number(asset.volume_amount).toFixed(2)}`, // fetch actual USD values
      },
      swapFees: "$0.00",
    }));
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw new Error("Failed to fetch assets");
  }
}
