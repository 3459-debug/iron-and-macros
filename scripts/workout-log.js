/* ==========================================================================
   Iron & Macros - workout-log.js
   Handles: PPL split checkoffs and the cardio / StairMaster log.
   Data is saved to localStorage so progress survives page reloads.
   ========================================================================== */

(function () {
  "use strict";

  /* ============================================================
     PART 1: PPL split completion checkoffs
     ============================================================ */
  var dayGrid = document.getElementById("dayGrid");
  if (dayGrid) {
    var CHECK_KEY = "ironMacrosChecks";

    var loadChecks = function () {
      try {
        return JSON.parse(localStorage.getItem(CHECK_KEY)) || {};
      } catch (e) {
        return {};
      }
    };

    var saveChecks = function (state) {
      localStorage.setItem(CHECK_KEY, JSON.stringify(state));
    };

    // Restore saved state + wire up change handlers
    var state = loadChecks();
    var boxes = dayGrid.querySelectorAll('input[type="checkbox"]');
    boxes.forEach(function (box) {
      // Restore
      if (state[box.id]) {
        box.checked = true;
        box.closest(".exercise-row").classList.add("done");
      }

      // On toggle
      box.addEventListener("change", function () {
        var s = loadChecks();
        if (box.checked) {
          s[box.id] = true;
          box.closest(".exercise-row").classList.add("done");
        } else {
          delete s[box.id];
          box.closest(".exercise-row").classList.remove("done");
        }
        saveChecks(s);
      });
    });
  }

  /* ============================================================
     PART 2: Cardio & StairMaster log
     ============================================================ */
  var addCardioBtn = document.getElementById("addCardioBtn");
  if (addCardioBtn) {
    var CARDIO_KEY = "ironMacrosCardio";
    var cardioTable = document.querySelector("#cardioTable tbody");

    var loadCardio = function () {
      try {
        return JSON.parse(localStorage.getItem(CARDIO_KEY)) || [];
      } catch (e) {
        return [];
      }
    };

    var saveCardio = function (sessions) {
      localStorage.setItem(CARDIO_KEY, JSON.stringify(sessions));
    };

    var renderCardio = function () {
      var sessions = loadCardio();
      cardioTable.innerHTML = "";

      sessions.forEach(function (s, i) {
        var tr = document.createElement("tr");

        var tdDate = document.createElement("td");
        tdDate.textContent = s.date;

        var tdType = document.createElement("td");
        tdType.textContent = s.type;

        var tdMin = document.createElement("td");
        tdMin.textContent = s.minutes;

        var tdCal = document.createElement("td");
        tdCal.textContent = s.calories;

        var tdAction = document.createElement("td");
        var delBtn = document.createElement("button");
        delBtn.textContent = "Remove";
        delBtn.className = "btn btn-outline btn-sm";
        delBtn.addEventListener("click", function () {
          var updated = loadCardio();
          updated.splice(i, 1);
          saveCardio(updated);
          renderCardio();
        });
        tdAction.appendChild(delBtn);

        tr.appendChild(tdDate);
        tr.appendChild(tdType);
        tr.appendChild(tdMin);
        tr.appendChild(tdCal);
        tr.appendChild(tdAction);
        cardioTable.appendChild(tr);
      });
    };

    addCardioBtn.addEventListener("click", function () {
      var type = document.getElementById("cardioType").value;
      var minutes = parseInt(document.getElementById("cardioMinutes").value, 10) || 0;
      var calories = parseInt(document.getElementById("cardioCalories").value, 10) || 0;

      var sessions = loadCardio();
      sessions.push({
        date: new Date().toLocaleDateString(),
        type: type,
        minutes: minutes,
        calories: calories
      });
      saveCardio(sessions);
      renderCardio();
    });

    renderCardio(); // initial render
  }
})();
