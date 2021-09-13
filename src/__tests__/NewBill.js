import { fireEvent, screen } from "@testing-library/dom"
import { getByTestId } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { htmlPrefilter } from "jquery"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
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

    test("Then only jpg, jpeg and png files should be accepted", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      // Object.defineProperty(window, 'localStorage', { value: mock})
      // window.localStorage.getItem('user', JSON.stringify({
      //   type: 'Employee'
      // }))
      // const onNavigate = (pathname) => {
      //   document.body.innerHTML = ROUTES({ pathname })
      // }
      // const newBill = new NewBill({
      //   document, onNavigate, firestore: null, localStorage: window.localStorage
      // })          
      const file = screen.queryByTestId("file")
      // const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e)) 
      // file.addEventListener('input', handleChangeFile)
      // userEvent.change(file)

      fireEvent.change(file, {target : File.name})

      const fileName = file.value
      const fileExtension = fileName.split('.').pop()
      const extensions = ".jpg" || ".jpeg" || ".png"
      //to-do write assertion
      expect(fileExtension).toEqual(extensions)
    })
  })
})