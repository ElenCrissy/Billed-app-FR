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
      file.value = ''

      expect(file).toBeTruthy()

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
      const imgJpg = document.createElement('img')
      imgJpg.src = '../assets/images/facturefreemobile.jpg'
      imgJpg.type = 'image/jpg'

      const img = require('../assets/images/facturefreemobile.jpg')
      const imgMock = jest.mock(img, () => 'facturefreemobile.jpg')

      fireEvent.change(file, {target : {value : `${imgMock}`}})
      expect(file.value).toEqual('facturefreemobile.jpg')
      // const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e)) 
      // file.addEventListener('input', handleChangeFile)
      // expect(handleChangeFile()).toHaveBeenCalled()

      //put appelé avec jpg et png
      expect(firestoreMock.storage.put(file)).toHaveBeenCalled()

      //put non appelé avec autre
      expect(firestoreMock.storage.put(file)).not.toHaveBeenCalled()

      const fileName = file.value
      const fileExtension = fileName.split('.').pop()
      const extensions = [".jpg", ".jpeg", ".png"]
      //to-do write assertion
      expect(file).toBeTruthy()
      expect(extensions).toContain(fileExtension)
    })
  })
})