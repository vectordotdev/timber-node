# Custom Events


Custom events allow you to extend beyond events already defined in [`timber.events`](https://timberio.github.io/timber-node/class/src/event.js~Event.html). If you aren't sure what an event is, please read the ["Metdata, Context, and Events" doc](/concepts/metadata-context-and-events).


## How to use it

```js
// Using console.log:
console.warn("Payment rejected", {
  event: {
    payment_rejected: { customer_id: "abcd1234", amount: 100, reason: "Card expired" }
  }
});

// Using winston:
winston.warn("Payment rejected", {
  event: {
    payment_rejected: { customer_id: "abcd1234", amount: 100, reason: "Card expired" }
  }
});

// Using bunyan:
logger.warn({
  event: {
    payment_rejected: { customer_id: "abcd1234", amount: 100, reason: "Card expired" }
  }
}, "Payment rejected");
```

1. [Search it](/app/console-log-viewer/searching) with queries like: `type:payment_rejected` or `payment_rejected.amount:>100`
2. [Alert on it](/app/alerts) with threshold based alerts
3. [Graph & visualize it](/app/graphs)
4. [View this event's data and context](/app/console-log-viewer/view-a-logs-metadata-context)


## How it works

When this event is received by the Timber service we'll define a namespaced schema based on the event name. In this case, the namespace would be `payment_rejected`. The data structure of your log will look like:

```json
{
  "message": "Payment rejected",
  "level": "warn",
  "event": {
    "custom": {
      "payment_rejected": {
        "customer_id": "abcd1234",
        "amount": 100,
        "reason": "Card expired"
      }
    }
  }
}
```
