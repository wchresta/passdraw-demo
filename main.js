
function addMustHave(name) {
    var child = document.createElement("li");
    child.className = "list-group-item d-flex justify-content-between align-items-center";
    child.innerHTML = `${name}<button data-name="${name}" type="button" class="btn btn-outline-danger btn-sm">Remove</button>`

    child.querySelector("button").onclick = (ev) => {
        removeMustHave(child);
    };

    document.getElementById("mustHaves").appendChild(child);
    calcPassProbability();
}

function removeMustHave(el) {
    document.getElementById("mustHaves").removeChild(el);
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

function calcPassProbability() {
    var pass = document.getElementsByName("pass")[0].value;
    var role = document.getElementsByName("role")[0].value;
    var rolePass = role + ":" + pass;

    var stats = lastYearStats[rolePass];
    console.log("rolePass", rolePass, "stats", stats);

    if (stats === undefined) {
        console.log("Not found");
        document.getElementById("pass-prob").text = "?";
    document.getElementById("chance-estimate").classList.add("d-none");
        return;
    }

    var baseProb = stats["passes"] / stats["registrations"];
    var numMustHaves = document.getElementById("mustHaves").querySelectorAll("li").length;
    var prob = baseProb / Math.pow(2,numMustHaves);
    console.log("prob:", prob);

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
