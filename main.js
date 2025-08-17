
var mustHavesContainer = document.getElementById("must-haves-container");
var mustHaves = document.getElementById("mustHaves");

function addMustHave(name) {
    var child = document.createElement("li");
    child.className = "list-group-item d-flex justify-content-between align-items-center";
    child.innerHTML = `${name}<button data-name="${name}" type="button" class="btn btn-outline-danger btn-sm">Remove</button>`

    child.querySelector("button").onclick = (ev) => {
        removeMustHave(child);
    };

    mustHaves.appendChild(child);
    calcPassProbability();
    manageMustHaveContainerVisibility();
}

function countMustHaves() {
    return mustHaves.querySelectorAll("li > button").length;
}

function manageMustHaveContainerVisibility() {
    if (countMustHaves() > 0) {
        mustHavesContainer.classList.remove("d-none");
    } else {
        mustHavesContainer.classList.add("d-none");
    }
}

function removeMustHave(el) {
    mustHaves.removeChild(el);
    manageMustHaveContainerVisibility();
    calcPassProbability();
}

const lastYearStats = {
    "leader:full": {
        "passes": 170,
        "registrations": 210,
    },
    "leader:party": {
        "passes": 70,
        "registrations": 120,
    },
    "follower:full": {
        "passes": 180,
        "registrations": 370,
    },
    "follower:party": {
        "passes": 80,
        "registrations": 210,
    },
};
const partnerKey = {
    "leader:full": "follower:full",
    "leader:party": "follower:party",
    "follower:full": "leader:full",
    "follower:party": "leader:party",
};

function calcPassProbability() {
    var pass = document.getElementsByName("pass")[0].value;
    var role = document.getElementsByName("role")[0].value;
    var rolePass = role + ":" + pass;

    var stats = lastYearStats[rolePass];

    if (stats === undefined) {
        console.log("Not found");
        document.getElementById("pass-prob").text = "?";
        document.getElementById("chance-estimate").classList.add("d-none");
        return;
    }

    var baseProb = stats["passes"] / stats["registrations"];
    var partners = countMustHaves();
    var partnerStats = lastYearStats[partnerKey[rolePass]];
    var partnerProb = partnerStats["passes"] / partnerStats["registrations"];

    var prob = baseProb * Math.pow(partnerProb,partners);

    document.getElementById("chance-estimate").classList.remove("d-none");
    document.getElementById("pass-prob").innerHTML = Math.round(prob * 100).toFixed(0) + " %";
}

document.getElementById("add-must-have-button").onclick = (ev) => {
    var newName = document.getElementById("add-must-have-input").value;

    if (newName === "") {
        document.getElementById("add-must-have-group").classList.add("was-validated");
        return;
    }
    document.getElementById("add-must-have-group").classList.remove("was-validated");
    addMustHave(newName);
    document.getElementById("add-must-have-input").value = "";
};

document.getElementById("reg-form").onchange = calcPassProbability;
calcPassProbability();
manageMustHaveContainerVisibility();
