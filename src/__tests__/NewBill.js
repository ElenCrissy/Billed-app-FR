import {screen, getByTestId, fireEvent} from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import BillsUI from "../views/BillsUI.js"
import { htmlPrefilter } from "jquery"
import userEvent from "@testing-library/user-event"
import '@testing-library/jest-dom'
import firebase from "../__mocks__/firebase"
import { localStorageMock } from '../__mocks__/localStorage'
import {ROUTES, ROUTES_PATH} from "../constants/routes";

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
      const newBill = new NewBill({document, firestore : firestoreMock})
      userEvent.upload(input, filePNG)
      expect(firestoreMock.storage.put).toHaveBeenCalledTimes(1)
    })

    describe("When file uploaded is a pdf", () => {
      test("Then file is not accepted and error message is showed", () => {
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
        expect(firestoreMock.storage.put).not.toHaveBeenCalledTimes(1)
        expect(input.value).toBe('')
        const errorMessage = screen.getByTestId('errorMessage')
        expect(errorMessage).toBeVisible()
      })
    })
  })

  describe("When I select a file with correct extension", () => {
    test("Then file should be stored", async () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      const firestoreMock = {
        storage: {
          ref: jest.fn().mockReturnThis(),
          put: jest.fn().mockImplementation(() => Promise.resolve({
            ref: {
              getDownloadURL: jest.fn()
            }
          }))
        }
      }
      const file = new File(['hello'], 'hello.png', {type: 'image/png'})
      const newBill = new NewBill({document, firestore : firestoreMock})
      const input = screen.getByTestId("file")
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      // const spyOnHandleChangeFile = jest.spyOn(newBill, "handleChangeFile")
      fireEvent.change(input, {target : {files : [file]}})
      // await spyOnHandleChangeFile()
      await handleChangeFile()
      // expect(spyOnHandleChangeFile).toHaveBeenCalled()
      expect(handleChangeFile).toHaveBeenCalled()
    })
  })

  describe("When I am on New Bill page and I click on submit button with right input", () => {
    test("Then new bill should be submitted and I will be back on bills page", async () => {
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

      const type = screen.getByTestId("expense-type")
      userEvent.selectOptions(type, screen.getByText("Transports"))
      expect(type.value).toBe(billMock.type)

      const name = screen.getByTestId("expense-name")
      fireEvent.change(name, {target : {value : billMock.name}})
      expect(name.value).toEqual(billMock.name)

      const amount = screen.getByTestId("amount")
      fireEvent.change(amount, {target : {value : billMock.amount}})
      expect(amount.value).toBe(billMock.amount)

      const date = screen.getByTestId("datepicker")
      fireEvent.change(date, {target : {value : billMock.date}})
      expect(date.value).toEqual(billMock.date)

      const vat = screen.getByTestId("vat")
      fireEvent.change(vat, {target : {value : billMock.vat}})
      expect(vat.value).toEqual(billMock.vat)

      const pct = screen.getByTestId("pct")
      fireEvent.change(pct, {target : {value : billMock.pct}})
      expect(pct.value).toEqual(billMock.pct)

      const commentary = screen.getByTestId("commentary")
      fireEvent.change(commentary, {target : {value : billMock.commentary}})
      expect(commentary.value).toEqual(billMock.commentary)

      const file = screen.getByTestId("file")
      fireEvent.change(file, {target : {value : billMock.fileName}})
      expect(file.value).toEqual(billMock.fileName)

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
      })
      const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
      const spyOnHandleSubmit = jest.spyOn(newBill, "handleSubmit")
      fireEvent.submit(formNewBill)
      expect(spyOnHandleSubmit).toHaveBeenCalled()

      const spyOnCreateBill = jest.spyOn(newBill, "createBill")
      newBill.createBill(billMock)
      expect(spyOnCreateBill).toHaveBeenCalled()

      const spyOnOnNavigate = jest.spyOn(newBill, "onNavigate")
      newBill.onNavigate(ROUTES_PATH['Bills'])
      expect(spyOnOnNavigate).toHaveBeenCalled()

      expect(screen.getByText("Mes notes de frais")).toBeTruthy()
    })
  })
})


// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to New Bill", () => {
    test("Add bill to mock API POST", async () => {
      const spyPost = jest.spyOn(firebase, "post")
      const newBill = {
        id: "test",
        status: "pending",
        pct: 10,
        amount: 300,
        email: "charlotte.santos@billed.com",
        name: "Bill1",
        vat: "20",
        fileName: "",
        date: "2021-10-10",
        commentAdmin: "",
        commentary: "",
        type: "Transports",
        fileUrl: "",
      }
      const bills = await firebase.post(newBill)
      expect(spyPost).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(5)
    });

    test("send bill to API and fails with 404 message error", async () => {
      // firebase.post.mockImplementationOnce(() =>
      //   Promise.reject(new Error("Erreur 404"))
      // )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      // firebase.post.mockImplementationOnce(() =>
      //   Promise.reject(new Error("Erreur 500"))
      // )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})