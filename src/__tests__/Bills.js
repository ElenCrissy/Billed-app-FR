import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js"
import firebase from "../__mocks__/firebase"

// localStorage

// const mock = (function() {
//   const store = {};
//   return {
//     getItem: function(key) {
//       return store[key];
//     },
//     setItem: function(key, value) {
//       store[key] = value.toString();
//     },
//     clear: function() {
//       store = {};
//     }
//   };
// })();

// Object.defineProperty(window, "localStorage", {
    //   value: {
    //     getItem: jest.fn(() => null),
    //     setItem: jest.fn(() => null)
    //   },
    //   writable: true
    // });

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    // Object.defineProperty(window, 'localStorage', { value: mock });
    // jest.spyOn(Storage.prototype, 'setItem')

    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
      // vérifier si mode employé
      // expect(window.localStorage.getItem('user')).toBe('Employee');
      // selectionner icon-window testId et vérifier si highlighted
      // const iconWindow = screen.getByTestId('icon-window')
      // expect(iconWindow).toHaveClass('.active-icon')
    })

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})

// test d'intégration GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to the bills", async () => {
    const getSpy = jest.spyOn(firebase, "get")
    const bills = await firebase.get()

    test.each(bills)("bill should have info and status", async () => {
      // expect(getSpy).toHaveBeenCalledTimes(1)

      const status = ["accepted", "pending", "refused"]
      expect(status).toContain(bill.status)
      expect(bill.name).not.toBeFalsy()
    })

    // test("fetches bills from an API and fails with 404 message error", async () => {
    //   firebase.get.mockImplementationOnce(() =>
    //     Promise.reject(new Error("Erreur 404"))
    //   )
    //   const html = DashboardUI({ error: "Erreur 404" })
    //   document.body.innerHTML = html
    //   const message = await screen.getByText(/Erreur 404/)
    //   expect(message).toBeTruthy()
    // })

    // test("fetches messages from an API and fails with 500 message error", async () => {
    //   firebase.get.mockImplementationOnce(() =>
    //     Promise.reject(new Error("Erreur 500"))
    //   )
    //   const html = DashboardUI({ error: "Erreur 500" })
    //   document.body.innerHTML = html
    //   const message = await screen.getByText(/Erreur 500/)
    //   expect(message).toBeTruthy()
    // })

    // test("Then it should show image", () => {

    // })
  })
})