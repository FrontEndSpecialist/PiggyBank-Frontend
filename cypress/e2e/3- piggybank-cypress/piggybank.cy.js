// Test scenario
describe("Geld overmaken naar een andere rekening", function () {
    // Test case
    it("Geld overmaken met een rekening waar geld op staat", function () {
      // Navigeer naar het overboeken url (Test step)
      cy.visit("http://localhost:3000/transfer");
    });
  });
  