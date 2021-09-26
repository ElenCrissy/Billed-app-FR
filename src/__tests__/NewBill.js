import { screen } from "@testing-library/dom"
import { getByTestId } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { htmlPrefilter } from "jquery"
import userEvent from "@testing-library/user-event"
import '@testing-library/jest-dom'



describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then only jpg, jpeg and png files should be accepted", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const input = screen.getByTestId("file")
      input.value = ''

      expect(input).toBeInTheDocument()

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

      const filePNG = new File(['hello'], 'hello.png', {type: 'image/png'})
      const filePDF = new File(['hello'], 'hello.pdf', {type: 'application/pdf'})

      const newBill = new NewBill({document, firestore : firestoreMock})  

      //put appelé avec png
      userEvent.upload(input, filePNG)
      expect(firestoreMock.storage.ref).toHaveBeenCalled()

      //put non appelé avec autre
      userEvent.upload(input, filePDF)
      expect(firestoreMock.storage.put).not.toHaveBeenCalled()
    })
  })
})