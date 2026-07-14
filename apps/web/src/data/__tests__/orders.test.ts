import { describe, it, expect } from "vitest";
import { formatStatus, orderStatusColor, ORDER_STATUS_FLOW, ORDER_TERMINAL_STATUSES } from "../orders";

describe("formatStatus", () => {
  it("formats PENDING to Pending", () => {
    expect(formatStatus("PENDING")).toBe("Pending");
  });

  it("formats CONFIRMED to Confirmed", () => {
    expect(formatStatus("CONFIRMED")).toBe("Confirmed");
  });

  it("formats PROCESSING to Processing", () => {
    expect(formatStatus("PROCESSING")).toBe("Processing");
  });

  it("formats SHIPPED to Shipped", () => {
    expect(formatStatus("SHIPPED")).toBe("Shipped");
  });

  it("formats DELIVERED to Delivered", () => {
    expect(formatStatus("DELIVERED")).toBe("Delivered");
  });

  it("formats CANCELLED to Cancelled", () => {
    expect(formatStatus("CANCELLED")).toBe("Cancelled");
  });

  it("formats RETURNED to Returned", () => {
    expect(formatStatus("RETURNED")).toBe("Returned");
  });

  it("formats REFUNDED to Refunded", () => {
    expect(formatStatus("REFUNDED")).toBe("Refunded");
  });

  it("returns unknown status as-is", () => {
    expect(formatStatus("UNKNOWN")).toBe("UNKNOWN");
  });
});

describe("orderStatusColor", () => {
  it("returns warning for PENDING", () => {
    expect(orderStatusColor.PENDING).toBe("warning");
  });

  it("returns default for CONFIRMED", () => {
    expect(orderStatusColor.CONFIRMED).toBe("default");
  });

  it("returns warning for PROCESSING", () => {
    expect(orderStatusColor.PROCESSING).toBe("warning");
  });

  it("returns default for SHIPPED", () => {
    expect(orderStatusColor.SHIPPED).toBe("default");
  });

  it("returns success for DELIVERED", () => {
    expect(orderStatusColor.DELIVERED).toBe("success");
  });

  it("returns destructive for CANCELLED", () => {
    expect(orderStatusColor.CANCELLED).toBe("destructive");
  });

  it("returns destructive for RETURNED", () => {
    expect(orderStatusColor.RETURNED).toBe("destructive");
  });

  it("returns secondary for REFUNDED", () => {
    expect(orderStatusColor.REFUNDED).toBe("secondary");
  });

  it("handles lowercase status keys for backward compatibility", () => {
    expect(orderStatusColor.Pending).toBe("warning");
    expect(orderStatusColor.Delivered).toBe("success");
    expect(orderStatusColor.Cancelled).toBe("destructive");
  });
});

describe("ORDER_STATUS_FLOW", () => {
  it("defines the correct progression order", () => {
    expect(ORDER_STATUS_FLOW).toEqual(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"]);
  });

  it("has exactly 5 steps", () => {
    expect(ORDER_STATUS_FLOW).toHaveLength(5);
  });
});

describe("ORDER_TERMINAL_STATUSES", () => {
  it("defines all terminal statuses", () => {
    expect(ORDER_TERMINAL_STATUSES).toEqual(["CANCELLED", "RETURNED", "REFUNDED"]);
  });

  it("has exactly 3 terminal statuses", () => {
    expect(ORDER_TERMINAL_STATUSES).toHaveLength(3);
  });

  it("terminal statuses are not in the flow", () => {
    for (const terminal of ORDER_TERMINAL_STATUSES) {
      expect(ORDER_STATUS_FLOW).not.toContain(terminal);
    }
  });
});
