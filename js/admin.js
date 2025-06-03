// Admin functionality
class AdminDashboard {
  constructor() {
    this.initSoilForm();
    this.initDistributorForm();
    this.loadSoils();
    this.loadDistributors();
    logger.log("Admin dashboard initialized");
  }

  initSoilForm() {
    document.getElementById("soil-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.addSoilType();
    });
  }

  initDistributorForm() {
    document
      .getElementById("distributor-form")
      .addEventListener("submit", (e) => {
        e.preventDefault();
        this.addDistributor();
      });
  }

  addSoilType() {
    utils.showLoader();
    const soilData = {
      name: document.getElementById("soil-name").value,
      type: document.getElementById("soil-type").value,
      composition: document.getElementById("soil-composition").value,
      phLevel: document.getElementById("soil-ph").value,
      nutrients: document.getElementById("soil-nutrients").value,
      suitableCrops: document
        .getElementById("soil-crops")
        .value.split(",")
        .map((item) => item.trim()),
      characteristics: document.getElementById("soil-characteristics").value,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    db.collection("soils")
      .add(soilData)
      .then(() => {
        logger.log(`New soil type added: ${soilData.name}`);
        utils.showSuccess("Soil type added successfully!");
        document.getElementById("soil-form").reset();
        this.loadSoils();
        utils.hideLoader();
      })
      .catch((error) => {
        logger.log(`Error adding soil type: ${error}`, "error");
        utils.showError("Error adding soil type. Please try again.");
        utils.hideLoader();
      });
  }

  addDistributor() {
    utils.showLoader();
    const distributorData = {
      name: document.getElementById("distributor-name").value,
      contact: document.getElementById("distributor-contact").value,
      email: document.getElementById("distributor-email").value,
      address: document.getElementById("distributor-address").value,
      cropsAvailable: document
        .getElementById("distributor-crops")
        .value.split(",")
        .map((item) => item.trim()),
      soilTypesCovered: document
        .getElementById("distributor-soils")
        .value.split(",")
        .map((item) => item.trim()),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    db.collection("distributors")
      .add(distributorData)
      .then(() => {
        logger.log(`New distributor added: ${distributorData.name}`);
        utils.showSuccess("Distributor added successfully!");
        document.getElementById("distributor-form").reset();
        this.loadDistributors();
        utils.hideLoader();
      })
      .catch((error) => {
        logger.log(`Error adding distributor: ${error}`, "error");
        utils.showError("Error adding distributor. Please try again.");
        utils.hideLoader();
      });
  }

  loadSoils() {
    db.collection("soils")
      .orderBy("createdAt", "desc")
      .get()
      .then((querySnapshot) => {
        const soilsList = document.getElementById("soils-list");
        soilsList.innerHTML = "";

        if (querySnapshot.empty) {
          soilsList.innerHTML = "<p>No soil types found.</p>";
          return;
        }

        querySnapshot.forEach((doc) => {
          const soil = doc.data();
          const soilItem = document.createElement("div");
          soilItem.className = "soil-item";
          soilItem.innerHTML = `
              <h3>${soil.name} (${soil.type})</h3>
              <p><strong>pH Level:</strong> ${soil.phLevel}</p>
              <p><strong>Suitable Crops:</strong> ${soil.suitableCrops.join(
                ", "
              )}</p>
              <button class="btn btn-danger btn-sm" onclick="adminDashboard.deleteSoil('${
                doc.id
              }')">Delete</button>
            `;
          soilsList.appendChild(soilItem);
        });
      })
      .catch((error) => {
        logger.log(`Error loading soils: ${error}`, "error");
        utils.showError("Error loading soil data.");
      });
  }

  loadDistributors() {
    db.collection("distributors")
      .orderBy("createdAt", "desc")
      .get()
      .then((querySnapshot) => {
        const distributorsList = document.getElementById("distributors-list");
        distributorsList.innerHTML = "";

        if (querySnapshot.empty) {
          distributorsList.innerHTML = "<p>No distributors found.</p>";
          return;
        }

        querySnapshot.forEach((doc) => {
          const distributor = doc.data();
          const distributorItem = document.createElement("div");
          distributorItem.className = "distributor-item";
          distributorItem.innerHTML = `
              <h3>${distributor.name}</h3>
              <p><strong>Contact:</strong> ${distributor.contact}</p>
              <p><strong>Crops Available:</strong> ${distributor.cropsAvailable.join(
                ", "
              )}</p>
              <button class="btn btn-danger btn-sm" onclick="adminDashboard.deleteDistributor('${
                doc.id
              }')">Delete</button>
            `;
          distributorsList.appendChild(distributorItem);
        });
      })
      .catch((error) => {
        logger.log(`Error loading distributors: ${error}`, "error");
        utils.showError("Error loading distributor data.");
      });
  }

  deleteSoil(id) {
    if (confirm("Are you sure you want to delete this soil type?")) {
      utils.showLoader();
      db.collection("soils")
        .doc(id)
        .delete()
        .then(() => {
          logger.log(`Soil type deleted: ${id}`);
          utils.showSuccess("Soil type deleted successfully!");
          this.loadSoils();
          utils.hideLoader();
        })
        .catch((error) => {
          logger.log(`Error deleting soil type: ${error}`, "error");
          utils.showError("Error deleting soil type.");
          utils.hideLoader();
        });
    }
  }

  deleteDistributor(id) {
    if (confirm("Are you sure you want to delete this distributor?")) {
      utils.showLoader();
      db.collection("distributors")
        .doc(id)
        .delete()
        .then(() => {
          logger.log(`Distributor deleted: ${id}`);
          utils.showSuccess("Distributor deleted successfully!");
          this.loadDistributors();
          utils.hideLoader();
        })
        .catch((error) => {
          logger.log(`Error deleting distributor: ${error}`, "error");
          utils.showError("Error deleting distributor.");
          utils.hideLoader();
        });
    }
  }
}

// Initialize admin dashboard
const adminDashboard = new AdminDashboard();
