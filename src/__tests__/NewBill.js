import {screen, getByTestId, fireEvent} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { htmlPrefilter } from "jquery"
import userEvent from "@testing-library/user-event"
import '@testing-library/jest-dom'
import firebase from "../__mocks__/firebase"
import { localStorageMock } from '../__mocks__/localStorage'
import {ROUTES, ROUTES_PATH} from "../constants/routes";

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

      userEvent.upload(input, filePNG)
      expect(firestoreMock.storage.put).toHaveBeenCalled()

      userEvent.upload(input, filePDF)
      expect(firestoreMock.storage.put).not.toHaveBeenCalled()
    })

    describe("When file uploaded is a pdf", () => {
      test("Then error message is showed", () => {
        const html = NewBillUI()
        document.body.innerHTML = html
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
        const input = screen.getByTestId("file")
        const filePDF = new File(['hello'], 'hello.pdf', {type: 'application/pdf'})
        userEvent.upload(input, filePDF)
        const errorMessage = screen.getByTestId('errorMessage')
        const errorStyle = errorMessage.getAttribute('style')
        console.log(errorStyle)
        expect(errorStyle).toHaveProperty('display', 'block')
      })
    })
  })

  describe("When I am on New Bill page and I click on submit button with right input", () => {
    test("Then new bill should be submitted and I will be back on bills page", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const billMock = {
        type : "Transports",
        name : "Test",
        amount: "100",
        date: "2021-08-09",
        vat : "10",
        pct: "20",
        commentary: "commentary",
        fileUrl: "",
        fileName: "",
      }

      // const type = screen.getByTestId("expense-type")
      // userEvent.selectOptions(type, screen.getByText("Transports"))
      // expect(type.value).toBe(billMock.type)

      // const name = screen.getByTestId("expense-name")
      // fireEvent.change(name, {target : {value : billMock.name}})
      // expect(name.value).toEqual(billMock.name)
      //
      // const amount = screen.getByTestId("amount")
      // fireEvent.change(amount, {target : {value : billMock.amount}})
      // expect(amount.value).toBe(billMock.amount)
      //
      // const date = screen.getByTestId("datepicker")
      // fireEvent.change(date, {target : {value : billMock.date}})
      // expect(date.value).toEqual(billMock.date)
      //
      // const vat = screen.getByTestId("vat")
      // fireEvent.change(vat, {target : {value : billMock.vat}})
      // expect(vat.value).toEqual(billMock.vat)
      //
      // const pct = screen.getByTestId("pct")
      // fireEvent.change(pct, {target : {value : billMock.pct}})
      // expect(pct.value).toEqual(billMock.pct)
      //
      // const commentary = screen.getByTestId("commentary")
      // fireEvent.change(commentary, {target : {value : billMock.commentary}})
      // expect(commentary.value).toEqual(billMock.commentary)

      // const file = screen.getByTestId("file")
      // fireEvent.change(file, {target : {value : billMock.file}})
      // expect(file.value).toEqual(billMock.file)

      Object.defineProperty(window, 'localStorage', { value: localStorageMock})
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
      }))

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const newBill = new NewBill({
        document, onNavigate, firestore, localStorage : window.localStorage
      } )

      const submitBtn = screen.getByTestId('btn-submit')
      expect(submitBtn).toBeTruthy()

      const handleSubmit = jest.fn(newBill.handleSubmit)
      submitBtn.addEventListener('submit', handleSubmit)
      fireEvent.submit(submitBtn)
      expect(handleSubmit).toHaveBeenCalled()

      const createBill = jest.fn(newBill.createBill)
      expect(createBill).toHaveBeenCalled()
      expect(newBill.onNavigate(ROUTES_PATH['Bills'])).toHaveBeenCalled()
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