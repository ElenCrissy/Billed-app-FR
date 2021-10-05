import { screen } from "@testing-library/dom"
import { getByTestId } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { htmlPrefilter } from "jquery"
import userEvent from "@testing-library/user-event"
import '@testing-library/jest-dom'
import firebase from "../__mocks__/firebase"

// à revoir

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
      expect(firestoreMock.storage.put).toHaveBeenCalled()

      //put non appelé avec autre
      // userEvent.upload(input, filePDF)
      // expect(firestoreMock.storage.put).not.toHaveBeenCalled()
    })

    test("Then I can submit the form", () => {
      // récupère valeur des champs remplis
      // lancement de createBill
      // onNavigate routepath Bills
    })
  })
})


// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to New Bill", () => {
    const firestoreMock = {
      bills : jest.fn().mockReturnThis(),
      add : jest.fn().mockImplementation(() => Promise.resolve({
        ref: {
          onNavigate : jest.fn()
        }
      })),
      catch : jest.fn()
    }

    test("send new bill to mock API POST", async () => {
       const postSpy = jest.spyOn(firebase, "post")
       expect(postSpy).toHaveBeenCalledTimes(1)
    })
    test("send bill to API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = NewBillUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = NewBillUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})