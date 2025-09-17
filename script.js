// Base Item class
class Item {
    constructor(name, weight) {
        this.name = name;
        this.weight = weight;
    }
}

// Interface (represented as a mixin in JS)
const Sortable = {
    canBeRecycled() {
        return true; // default
    }
};

// Plastic Class (inherits default 'Sortable' behavior)
class Plastic extends Item {}
Object.assign(Plastic.prototype, Sortable);

// Glass Class (inherits default 'Sortable' behavior)
class Glass extends Item {}
Object.assign(Glass.prototype, Sortable);

// Metal Class (inherits default 'Sortable' behavior)
class Metal extends Item {}
Object.assign(Metal.prototype, Sortable);

// Wood Class (overrides 'canBeRecycled' to be false)
class Wood extends Item {
    canBeRecycled() {
        return false;
    }
}
// Note: This no longer uses Object.assign to avoid overwriting the method
// The explicit method takes precedence.

// Category Engine
class CategoryEngine {
    static classify(name, weight) {
        const lower = name.toLowerCase();

        // 1. High-priority: Classify by name
        if (lower.includes("plastic")) return new Plastic(name, weight);
        if (lower.includes("glass")) return new Glass(name, weight);
        if (lower.includes("metal")) return new Metal(name, weight);
        if (lower.includes("wood")) return new Wood(name, weight);

        // 2. Low-priority: Classify by weight (mutually exclusive rules)
        if (weight < 2) {
            return new Plastic(name, weight);
        } else if (weight >= 2 && weight < 5) {
            return new Glass(name, weight);
        } else if (weight >= 5 && weight < 15) {
            return new Wood(name, weight);
        } else { // weight is 15 or more
            return new Metal(name, weight);
        }
    }
}

// --- Main Program Logic (DOM Manipulation) ---
document.addEventListener("DOMContentLoaded", () => {
    const classifyBtn = document.getElementById("classifyBtn");
    const itemNameInput = document.getElementById("itemName");
    const itemWeightInput = document.getElementById("itemWeight");
    const itemList = document.getElementById("itemList");

    classifyBtn.addEventListener("click", () => {
        const name = itemNameInput.value.trim();
        const weight = parseFloat(itemWeightInput.value);

        if (!name || isNaN(weight)) {
            alert("Please enter a valid item name and weight.");
            return;
        }

        const item = CategoryEngine.classify(name, weight);

        // Create a new list item element
        const newLi = document.createElement("li");
        const recyclableStatus = item.canBeRecycled() ? "Yes" : "No";
        const recyclableClass = item.canBeRecycled() ? "recyclable-yes" : "recyclable-no";

        newLi.innerHTML = `
            <span>${item.name} (${item.weight} kg) → <strong>${item.constructor.name}</strong></span>
            <span class="${recyclableClass}">Recyclable: ${recyclableStatus}</span>
        `;
        
        // Add the new item to the list
        itemList.appendChild(newLi);

        // Clear input fields
        itemNameInput.value = "";
        itemWeightInput.value = "";
    });
});
