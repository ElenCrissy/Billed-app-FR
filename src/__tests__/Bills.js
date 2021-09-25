import { fireEvent, screen, getByTestId } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js"
import firebase from "../__mocks__/firebase"
import localStorageMock from '../__mocks__/localStorage'
// import { Router } from "express"
// ***
import { ROUTES } from "../constants/routes.js"
import Router from "../app/Router.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {

    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
      // vérifier si mode employé
      const newRouter = Router.createElement('div')
      newRouter.innerHTML = new ROUTES ({pathname :'#employee/bill/' })
      expect(newRouter.pathname).toEqual('#employee/bill/')
      // expect(window.location.hash).toBe("#employee/bill/")

      // const userString = window.localStorage.getItem('user')
      // const user = JSON.parse(userString)
      // expect(window.location.hash).toBe("#employee/bill/")
      // expect(user.type).toBe('Employee')

      // selectionner icon-window testId et vérifier si highlighted
      const billIcon = screen.getByTestId('layout-icon1')
      expect(billIcon).toHaveClass('active-icon')
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

// test unitaire

describe("Given I am user connected as Employee", () => {
  describe("When I navigate to the bills", async () => {
    const getSpy = jest.spyOn(firebase, "get")
    const bills = await firebase.get()

    test.each(bills)("bill should have info and status", () => {
      expect(getSpy).toHaveBeenCalled()

      const billType = screen.getByTestId("bill-type")
      const billAmount = screen.getByTestId("bill-amount")
      const billDate = screen.getByTestId("bill-date")
      const billStatus = screen.getByTestId("bill-status")
      const iconEye = screen.getByTestId("icon-eye")
      expect(iconEye).toBeTruthy()
      expect(billType).toEqual(bill.type)
      expect(billAmount).toEqual(bill.amount)
      expect(billDate).toHaveText(bill.date)
      expect(billStatus).toEqual(bill.status)
    })

    describe("When I click on icon-eye", () => {

      test.each(bills)("Then opens modal with image", () => {
  
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
  
        // const mockCallBack = jest.fn();
  
        // const button = shallow((<Button onClick={mockCallBack}>Ok!</Button>));
        // button.find('button').simulate('click');
        // expect(mockCallBack.mock.calls.length).toEqual(1);
  
        const bill = new Bills({document, firestore : firestoreMock})
        const iconEye = screen.getByTestId("icon-eye")
        const handleClickIconEye = jest.fn((e) => bill.handleClickIconEye(icon)) 
        iconEye.addEventListener('click', handleClickIconEye)
        expect(handleClickIconEye()).toHaveBeenCalled()
      })
    })
  })
})

// test d'intégration GET

describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to the bills", async () => {
    const getSpy = jest.spyOn(firebase, "get")
    const bills = await firebase.get()
    expect(getSpy).toHaveBeenCalledTimes(1)
    expect(bills.data.length).toBe(4)

    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})