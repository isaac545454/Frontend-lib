const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatMoney(value: number) {
  return money.format(value);
}

export function installmentLabel(price: number) {
  if (price < 80) return null;
  return `12x de ${money.format(price / 12)} sem juros`;
}
