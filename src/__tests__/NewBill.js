import { fireEvent, screen } from "@testing-library/dom"
import { getByTestId } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { htmlPrefilter } from "jquery"
// import imageJPG from '../assets/images/facturefreemobile.jpg';
// import imagePNG from '../assets/images/algo1v3.png';



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
      const imgJPG = document.createElement('img')
      // imgJpg.src = '../assets/images/facturefreemobile.jpg'
      // imgJpg.type = 'image/jpg'

      // const imgJPG = require('../assets/images/facturefreemobile.jpg')
      // const imgPNG = require('../assets/images/algo1v3.png')
      
      const imgJPGMock = jest.mock(imgJPG, () => {name: 'facturefreemobile.jpg'})
      // const imgPNGMock = jest.mock(imgPNG, () => 'algo1v3.png')

      // fireEvent.change(file, {target : {value : `${imgJPGMock}`}})
      // expect(file.name).toEqual(imgJPGMock.name)

      const fileDetails = file.files[0]
      const fileName = file.value 
      const fileExtension = fileName.split('.').pop()
      fileExtension = ('.jpg' || '.png')

      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e)) 
      file.addEventListener('input', handleChangeFile)
      expect(handleChangeFile()).toHaveBeenCalled()

      //put appelé avec jpg et png
      expect(firestoreMock.storage.put(fileDetails)).toHaveBeenCalled()

      //put non appelé avec autre
      fileExtension = !('.jpeg' || '.jpg' || '.png')
      expect(firestoreMock.storage.put(fileDetails)).not.toHaveBeenCalled()

      // const fileName = file.value
      // const fileExtension = fileName.split('.').pop()
      // const extensions = [".jpg", ".jpeg", ".png"]
      // //to-do write assertion
      // expect(extensions).toContain(fileExtension)
    })
  })
})