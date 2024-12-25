function probabilityOfMOrMoreSameSimulated(n, m, c) {
  if (n < m || m <= 0 || m > n) {
    throw new Error("Invalid input: ensure 0 < m <= n.");
  }
  if (c <= 0) {
    throw new Error("Invalid input: c must be a positive integer.");
  }

  const sides = 6;

  // Helper function to roll n dice
  function rollDice(n) {
    const rolls = Array(n)
      .fill(0)
      .map(() => Math.ceil(Math.random() * sides));
    return rolls;
  }

  // Helper function to check if m or more dice match
  function hasMOrMoreMatches(rolls, m) {
    const counts = new Array(sides).fill(0);
    rolls.forEach((side) => counts[side - 1]++);
    return counts.some((count) => count >= m);
  }

  // Simulate c rolls and count how many meet the condition
  let matches = 0;

  for (let i = 0; i < c; i++) {
    const rolls = rollDice(n);
    if (hasMOrMoreMatches(rolls, m)) {
      matches++;
    }
  }

  // Compute and return the probability
  return Math.round((matches / c) * 100) / 100; // Round to 2 decimals
}

let debounceTimeout;

document.getElementById("n").addEventListener("input", function () {
  const n = parseInt(this.value);

  // Clear the previous timeout to start a new debounce delay
  clearTimeout(debounceTimeout);

  // Start the debounce timer (500ms delay)
  debounceTimeout = setTimeout(function () {
    // If the value of n is valid
    if (n && n >= 1) {
      runSimulation(n);
    }
  }, 750); // Delay of 750ms
});

function runSimulation(n) {
  // Show the result section
  document.getElementById("result").classList.remove("hidden");

  const tableBody = document.getElementById("probabilityTable");
  tableBody.innerHTML = ""; // Clear previous table rows

  // Set c to a default value (10000) for simulations
  const c = 10000;

  if (isNaN(n) || n <= 0) {
    alert("Please enter a valid number of dice.");
    return;
  }

  let lastHighProbabilityRow = null; // Store the row for the last probability >= 0.99
  let startDisplaying = false; // Start displaying rows after probability > 0.99
  let thresholdReached = false; // Stop simulation once probability <= 0.1 is reached

  for (let m = 1; m <= 15; m++) {
    const probability = probabilityOfMOrMoreSameSimulated(n, m, c);

    // Check if we should stop simulating (threshold for <= 0.1)
    if (probability <= 0.1) {
      // Add the last high-probability row if it hasn't been added
      if (lastHighProbabilityRow && !startDisplaying) {
        tableBody.appendChild(lastHighProbabilityRow);
        lastHighProbabilityRow = null; // Clear after adding
      }

      // Add the current row for the low-probability value
      const row = document.createElement("tr");
      row.classList.add("border-b", "border-gray-200", "dark:border-gray-600");

      const mCell = document.createElement("td");
      mCell.classList.add(
        "px-4",
        "py-2",
        "text-gray-700",
        "dark:text-gray-200",
        "text-2xl"
      );
      mCell.textContent = m;

      const probabilityCell = document.createElement("td");
      probabilityCell.classList.add(
        "px-4",
        "py-2",
        "text-gray-700",
        "dark:text-gray-200",
        "text-2xl"
      );
      probabilityCell.textContent = probability.toFixed(2); // Rounded to 2 decimal places

      row.appendChild(mCell);
      row.appendChild(probabilityCell);

      tableBody.appendChild(row);

      // Stop further simulation
      thresholdReached = true;
      break;
    }

    // Handle probabilities >= 0.99
    if (probability >= 0.99) {
      // Update the last high-probability row to display later
      lastHighProbabilityRow = document.createElement("tr");
      lastHighProbabilityRow.classList.add(
        "border-b",
        "border-gray-200",
        "dark:border-gray-600",
        "text-2xl"
      );

      const mCell = document.createElement("td");
      mCell.classList.add(
        "px-4",
        "py-2",
        "text-gray-700",
        "dark:text-gray-200",
        "text-2xl"
      );
      mCell.textContent = m;

      const probabilityCell = document.createElement("td");
      probabilityCell.classList.add(
        "px-4",
        "py-2",
        "text-gray-700",
        "dark:text-gray-200",
        "text-2xl"
      );
      probabilityCell.textContent = probability.toFixed(2); // Rounded to 2 decimal places

      lastHighProbabilityRow.appendChild(mCell);
      lastHighProbabilityRow.appendChild(probabilityCell);

      continue; // Do not display this row yet
    }

    // Start displaying rows after probability drops below 0.99
    if (!startDisplaying) {
      // Add the last high-probability row before continuing
      if (lastHighProbabilityRow) {
        tableBody.appendChild(lastHighProbabilityRow);
        lastHighProbabilityRow = null; // Clear after adding
      }
      startDisplaying = true;
    }

    // Add rows for probabilities between 0.99 and 0.05
    const row = document.createElement("tr");
    row.classList.add("border-b", "border-gray-200", "dark:border-gray-600");

    const mCell = document.createElement("td");
    mCell.classList.add(
      "px-4",
      "py-2",
      "text-gray-700",
      "dark:text-gray-200",
      "text-2xl"
    );
    mCell.textContent = m;

    const probabilityCell = document.createElement("td");
    probabilityCell.classList.add(
      "px-4",
      "py-2",
      "text-gray-700",
      "dark:text-gray-200",
      "text-2xl"
    );
    probabilityCell.textContent = probability.toFixed(2); // Rounded to 2 decimal places

    row.appendChild(mCell);
    row.appendChild(probabilityCell);

    tableBody.appendChild(row);
  }

  // Handle the case where no thresholds were reached (unlikely due to low/high thresholds)
  if (!thresholdReached && !tableBody.hasChildNodes()) {
    const noDataRow = document.createElement("tr");
    noDataRow.classList.add(
      "border-b",
      "border-gray-200",
      "dark:border-gray-600",
      "text-2xl"
    );

    const noDataCell = document.createElement("td");
    noDataCell.colSpan = 2;
    noDataCell.classList.add(
      "px-4",
      "py-2",
      "text-gray-700",
      "dark:text-gray-200",
      "text-center",
      "text-2xl"
    );
    noDataCell.textContent = "No probabilities met the thresholds.";

    noDataRow.appendChild(noDataCell);
    tableBody.appendChild(noDataRow);
  }
}

// Handle button click to calculate probabilities
document.getElementById("calculateBtn").addEventListener("click", function () {
  const n = parseInt(document.getElementById("n").value);

  // Set c to a default value (10000) for simulations
  const c = 10000;

  if (isNaN(n) || n <= 0) {
    alert("Please enter a valid number of dice.");
    return;
  }

  // Clear the existing table rows
  const tableBody = document.getElementById("probabilityTableBody");
  tableBody.innerHTML = "";

  let lastHighProbabilityRow = null; // Store the row for the last probability >= 0.99
  let startDisplaying = false; // Start displaying rows after probability > 0.99
  let thresholdReached = false; // Stop simulation once probability <= 0.1 is reached

  for (let m = 1; m <= 15; m++) {
    const probability = probabilityOfMOrMoreSameSimulated(n, m, c);

    // Check if we should stop simulating (threshold for <= 0.1)
    if (probability <= 0.1) {
      // Add the last high-probability row if it hasn't been added
      if (lastHighProbabilityRow && !startDisplaying) {
        tableBody.appendChild(lastHighProbabilityRow);
        lastHighProbabilityRow = null; // Clear after adding
      }

      // Add the current row for the low-probability value
      const row = document.createElement("tr");
      row.classList.add("border-b", "border-gray-200", "dark:border-gray-600");

      const mCell = document.createElement("td");
      mCell.classList.add(
        "px-4",
        "py-2",
        "text-gray-700",
        "dark:text-gray-200",
        "text-2xl"
      );
      mCell.textContent = m;

      const probabilityCell = document.createElement("td");
      probabilityCell.classList.add(
        "px-4",
        "py-2",
        "text-gray-700",
        "dark:text-gray-200",
        "text-2xl"
      );
      probabilityCell.textContent = probability.toFixed(2); // Rounded to 2 decimal places

      row.appendChild(mCell);
      row.appendChild(probabilityCell);

      tableBody.appendChild(row);

      // Stop further simulation
      thresholdReached = true;
      break;
    }

    // Handle probabilities >= 0.99
    if (probability >= 0.99) {
      // Update the last high-probability row to display later
      lastHighProbabilityRow = document.createElement("tr");
      lastHighProbabilityRow.classList.add(
        "border-b",
        "border-gray-200",
        "dark:border-gray-600",
        "text-2xl"
      );

      const mCell = document.createElement("td");
      mCell.classList.add(
        "px-4",
        "py-2",
        "text-gray-700",
        "dark:text-gray-200",
        "text-2xl"
      );
      mCell.textContent = m;

      const probabilityCell = document.createElement("td");
      probabilityCell.classList.add(
        "px-4",
        "py-2",
        "text-gray-700",
        "dark:text-gray-200",
        "text-2xl"
      );
      probabilityCell.textContent = probability.toFixed(2); // Rounded to 2 decimal places

      lastHighProbabilityRow.appendChild(mCell);
      lastHighProbabilityRow.appendChild(probabilityCell);

      continue; // Do not display this row yet
    }

    // Start displaying rows after probability drops below 0.99
    if (!startDisplaying) {
      // Add the last high-probability row before continuing
      if (lastHighProbabilityRow) {
        tableBody.appendChild(lastHighProbabilityRow);
        lastHighProbabilityRow = null; // Clear after adding
      }
      startDisplaying = true;
    }

    // Add rows for probabilities between 0.99 and 0.05
    const row = document.createElement("tr");
    row.classList.add("border-b", "border-gray-200", "dark:border-gray-600");

    const mCell = document.createElement("td");
    mCell.classList.add(
      "px-4",
      "py-2",
      "text-gray-700",
      "dark:text-gray-200",
      "text-2xl"
    );
    mCell.textContent = m;

    const probabilityCell = document.createElement("td");
    probabilityCell.classList.add(
      "px-4",
      "py-2",
      "text-gray-700",
      "dark:text-gray-200",
      "text-2xl"
    );
    probabilityCell.textContent = probability.toFixed(2); // Rounded to 2 decimal places

    row.appendChild(mCell);
    row.appendChild(probabilityCell);

    tableBody.appendChild(row);
  }

  // Handle the case where no thresholds were reached (unlikely due to low/high thresholds)
  if (!thresholdReached && !tableBody.hasChildNodes()) {
    const noDataRow = document.createElement("tr");
    noDataRow.classList.add(
      "border-b",
      "border-gray-200",
      "dark:border-gray-600",
      "text-2xl"
    );

    const noDataCell = document.createElement("td");
    noDataCell.colSpan = 2;
    noDataCell.classList.add(
      "px-4",
      "py-2",
      "text-gray-700",
      "dark:text-gray-200",
      "text-center",
      "text-2xl"
    );
    noDataCell.textContent = "No probabilities met the thresholds.";

    noDataRow.appendChild(noDataCell);
    tableBody.appendChild(noDataRow);
  }
});
