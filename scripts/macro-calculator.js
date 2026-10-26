/* ==========================================================================
   Iron & Macros - macro-calculator.js
   Handles: home quick-check, full macro calculator, and meal tracker.
   Data is saved to localStorage so entries survive page reloads.
   ========================================================================== */

(function () {
  "use strict";

  /* ============================================================
     PART 1: Home page quick macro check
     ============================================================ */
  var quickBtn = document.getElementById("quickCalcBtn");
  if (quickBtn) {
    var quickWeight = document.getElementById("quickWeight");
    var quickDays = document.getElementById("quickDays");
    var quickKcal = document.getElementById("quickKcal");
    var quickProtein = document.getElementById("quickProtein");

    var runQuickCalc = function () {
      var w = parseFloat(quickWeight.value) || 155;
      var d = parseFloat(quickDays.value) || 6;

      // Base multiplier 16, plus 0.4 per training day above 3
      var multiplier = 16 + Math.max(0, d - 3) * 0.4;
      var kcal = Math.round(w * multiplier);
      var protein = Math.round(w);

      quickKcal.textContent = kcal.toLocaleString();
      quickProtein.textContent = protein.toLocaleString();
    };

    quickBtn.addEventListener("click", runQuickCalc);
    runQuickCalc(); // populate on load
  }

  /* ============================================================
     PART 2: Full macro calculator (macros.html)
     ============================================================ */
  var calcBtn = document.getElementById("calcBtn");
  if (calcBtn) {
    var runFullCalc = function () {
      var w = parseFloat(document.getElementById("calcWeight").value) || 155;
      var h = parseFloat(document.getElementById("calcHeight").value) || 70;
      var a = parseFloat(document.getElementById("calcAge").value) || 21;
      var sex = document.getElementById("calcSex").value;
      var goal = document.getElementById("calcGoal").value;

      // Mifflin-St Jeor BMR
      var bmr;
      if (sex === "male") {
        bmr = 10 * (w / 2.2046) + 6.25 * 2.54 * h - 5 * a + 5;
      } else {
        bmr = 10 * (w / 2.2046) + 6.25 * 2.54 * h - 5 * a - 161;
      }

      // Activity multiplier tuned for 6-day training week
      var tdee = bmr * 1.55;

      // Apply goal adjustment
      var kcal;
      if (goal === "cut") {
        kcal = tdee * 0.85;
      } else if (goal === "bulk") {
        kcal = tdee * 1.10;
      } else {
        kcal = tdee;
      }
      kcal = Math.round(kcal);

      // Protein: 1g per lb bodyweight
      var protein = Math.round(w);

      // Fat: 25% of calories
      var fat = Math.round((kcal * 0.25) / 9);

      // Carbs: remainder
      var carbs = Math.round((kcal - protein * 4 - fat * 9) / 4);

      document.getElementById("rKcal").textContent = kcal.toLocaleString();
      document.getElementById("rProtein").textContent = protein + "g";
      document.getElementById("rCarbs").textContent = carbs + "g";
      document.getElementById("rFat").textContent = fat + "g";
    };

    calcBtn.addEventListener("click", runFullCalc);
    runFullCalc(); // populate on load
  }

  /* ============================================================
     PART 3: Meal tracker (macros.html)
     ============================================================ */
  var addMealBtn = document.getElementById("addMealBtn");
  if (addMealBtn) {
    // Nutrition per serving for each staple food
    var FOODS = {
      "Eggs (2 large)":        { kcal: 140, protein: 12 },
      "Chicken Breast (8oz)":  { kcal: 280, protein: 52 },
      "White Rice (1 cup)":    { kcal: 205, protein: 4 },
      "Oats (1 cup dry)":      { kcal: 307, protein: 11 },
      "Whey Shake (1 scoop)":  { kcal: 120, protein: 24 },
      "Peanut Butter (2 tbsp)":{ kcal: 190, protein: 7 }
    };

    var STORAGE_KEY = "ironMacrosMeals";
    var mealTable = document.querySelector("#mealTable tbody");

    var loadMeals = function () {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch (e) {
        return [];
      }
    };

    var saveMeals = function (meals) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
    };

    var renderMeals = function () {
      var meals = loadMeals();
      mealTable.innerHTML = "";

      meals.forEach(function (meal, i) {
        var tr = document.createElement("tr");

        var tdName = document.createElement("td");
        tdName.textContent = meal.name;

        var tdQty = document.createElement("td");
        tdQty.textContent = meal.qty;

        var tdKcal = document.createElement("td");
        tdKcal.textContent = meal.kcal;

        var tdProtein = document.createElement("td");
        tdProtein.textContent = meal.protein + "g";

        var tdAction = document.createElement("td");
        var delBtn = document.createElement("button");
        delBtn.textContent = "Remove";
        delBtn.className = "btn btn-outline btn-sm";
        delBtn.addEventListener("click", function () {
          var updated = loadMeals();
          updated.splice(i, 1);
          saveMeals(updated);
          renderMeals();
        });
        tdAction.appendChild(delBtn);

        tr.appendChild(tdName);
        tr.appendChild(tdQty);
        tr.appendChild(tdKcal);
        tr.appendChild(tdProtein);
        tr.appendChild(tdAction);
        mealTable.appendChild(tr);
      });

      // Update totals
      var totKcal = 0;
      var totProtein = 0;
      meals.forEach(function (m) {
        totKcal += m.kcal;
        totProtein += m.protein;
      });
      document.getElementById("totalKcal").textContent = totKcal.toLocaleString();
      document.getElementById("totalProtein").textContent = totProtein.toLocaleString();
    };

    addMealBtn.addEventListener("click", function () {
      var name = document.getElementById("mealName").value;
      var qty = parseInt(document.getElementById("mealQty").value, 10) || 1;
      var food = FOODS[name] || { kcal: 0, protein: 0 };

      var meals = loadMeals();
      meals.push({
        name: name,
        qty: qty,
        kcal: food.kcal * qty,
        protein: food.protein * qty
      });
      saveMeals(meals);
      renderMeals();
    });

    renderMeals(); // initial render
  }

  /* ============================================================
     PART 4: Feedback form draft (contact.html)
     ============================================================ */
  var feedbackForm = document.getElementById("feedbackForm");
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = document.getElementById("fbNote");
      var draft = {
        name: document.getElementById("fbName").value,
        email: document.getElementById("fbEmail").value,
        topic: document.getElementById("fbTopic").value,
        message: document.getElementById("fbMessage").value,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem("ironMacrosFeedback", JSON.stringify(draft));
      note.textContent = "Draft saved locally on " + new Date().toLocaleString() + ". (No email is sent - demo form.)";
      note.style.color = "#38bdf8";
    });
  }
})();
