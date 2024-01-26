/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe("End to End tests", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the cy.visit() command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:3000/");
  });

  it("maak een overboeking, valuta 'euro'", () => {
    cy.visit("http://localhost:3000/login");

    cy.contains(".login__account", "Sara").click();

    cy.contains(".accounts__account-name", "Sara").click();

    cy.visit("http://localhost:3000/transfer");

    cy.get('select[name="toaccount"]').select("3");
    cy.get('select[name="currency"]').select("EURO");
    cy.get('input[name="amount"]').type("50");
    cy.get('textarea[name="description"]').type("Sara -> Cem");

    cy.intercept("POST", "http://localhost:8080/api/v1/transactions").as(
      "submitTransfer"
    );

    cy.get("form").submit();

    cy.wait("@submitTransfer").then(({ request }) => {
      console.log(request.body);

      cy.get("h1").should("contain.text", "Gelukt!");
      cy.get(".alert").should(
        "contain.text",
        "👍 Het is gelukt om € 50 over te maken!"
      );
    });
  });

  it("maak een overboeking en controleer bedragen in GBP", () => {
    cy.visit("http://localhost:3000/login");

    cy.contains(".login__account", "Sara").click();
    cy.contains(".accounts__account-name", "Sara").click();

    cy.visit("http://localhost:3000/transfer");

    cy.get('select[name="toaccount"]').select("3");
    cy.get('select[name="currency"]').select("GBP");
    cy.get('input[name="amount"]').type("10");
    cy.get('textarea[name="description"]').type("Sara -> Cem");

    cy.intercept("POST", "http://localhost:8080/api/v1/transactions").as(
      "submitTransfer"
    );

    cy.get("form").submit();

    cy.wait("@submitTransfer").then(({ response }) => {
      expect(response.statusCode).to.equal(200);

      cy.get("h1").should("contain.text", "Gelukt!");
      cy.get(".alert").should(
        "contain.text",
        "👍 Het is gelukt om £ 10 over te maken!"
      );
    });

    cy.visit("http://localhost:3000/transactions");

    const euroAmount = 10;
    const exchangeRate = 1.1;
    const expectedPoundAmount = (euroAmount * exchangeRate).toFixed(2) * -1;

    cy.get(".transaction__amount.amount-credit")
      .first()
      .should("have.text", `£ ${expectedPoundAmount}`);
  });
});
