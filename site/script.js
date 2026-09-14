function convertCToF(celsius) {
  return (celsius * 9) / 5 + 32;
}

if (typeof document !== "undefined") {
  const button = document.getElementById("convertBtn");
  button.addEventListener("click", () => {
    const celsius = Number(document.getElementById("celsius").value);
    const fahrenheit = convertCToF(celsius);
    document.getElementById("result").textContent =
      celsius + " Celsius is " + fahrenheit + " Fahrenheit";
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { convertCToF };
}
