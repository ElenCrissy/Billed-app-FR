import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    // var mock = (function() {
    //   var store = {};
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
    // Object.defineProperty(window, 'localStorage', { value: mock });

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null)
      },
      writable: true
    });
    
    // const user = localStorage.getItem('user')
    //if user = employee then test :
    // jest.spyOn(Storage.prototype, 'setItem')
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
      // set page on employee mode
      // jest.spyOn(window.localStorage.__proto__, 'getItem')
      // window.localStorage.__proto__.getItem = jest.fn();
      // select icon-window testId and check if highlighted
      const iconWindow = screen.getByTestId('icon-window')
      expect(iconWindow).toHaveClass('.active-icon')
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