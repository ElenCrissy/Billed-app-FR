import { fireEvent, screen } from "@testing-library/dom"
import { getByTestId } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { htmlPrefilter } from "jquery"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then only jpg, jpeg and png files should be accepted", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const file = screen.getByTestId("file")
      const firestoreMock = {
        storage : {
          ref : jest.fn().mockReturnThis(),
          put : jest.fn().mockImplementation(() => Promise.resolve({
            ref: {
              getDownloadURL : jest.fn()
            }
          }))
        }
      }
      
      const newBill = new NewBill({document, firestore : firestoreMock})
      
      // const truc= {
      //   document : document
      // }
      // const truc2 = {document}

      const fileName = file.value
      const fileExtension = fileName.split('.').pop()
      const extensions = [".jpg", ".jpeg", ".png"]
      //to-do write assertion
      expect(file).toBeTruthy()
      expect(extensions).toContain(fileExtension)
    })
  })
})