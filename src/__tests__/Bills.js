import { fireEvent, screen, getByTestId } from "@testing-library/dom"
import userEvent from "@testing-library/user-event"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js"
import firebase from "../__mocks__/firebase"
import { localStorageMock } from '../__mocks__/localStorage'
import {ROUTES, ROUTES_PATH} from "../constants/routes.js"
import Router from "../app/Router.js"
import LoadingPage from "../views/LoadingPage.js"
import ErrorPage from "../views/ErrorPage.js"
import Firestore from "../app/Firestore";
import Dashboard from "../containers/Dashboard";
import DashboardUI from "../views/DashboardUI";
import * as path from "path";


describe("Given I am connected as an employee", () => {
  describe("When page is loading", () => {
    test("Then Loading Page is returned", () => {
      const html = BillsUI({loading : true})
      expect(LoadingPage()).toEqual(html)
    })
  })

  describe("When page is not loading", () => {
    test("Then error page is returned", () => {
      const html = BillsUI({error : "true"})
      const errorMessage = "true"
      expect(ErrorPage(errorMessage)).toEqual(html)
    })
  })

  describe("When I am on Bills Page", () => {

    // à revoir
    test("Then bill icon in vertical layout should be highlighted", () => {
      // const html = BillsUI({data:[]})
      // document.body.innerHTML = html
      //to-do write expect expression
      window.localStorage.setItem('user', JSON.stringify({
        type : 'Employee',
      }))
      window.firebase = {
        firestore : () => ({
          collection : () => ({
            get : jest.fn(() => Promise.resolve([]))
          })
        })
      }
      document.body.innerHTML = `<div id='root' data-testid="root"></div>`
      Router()
      window.onNavigate(ROUTES_PATH['Bills'])

      const billIcon = screen.getByTestId('icon-window')
      expect(billIcon.classList.contains('active-icon')).toBeTruthy()
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
// à revoir

describe("Given I am user connected as Employee", () => {
  describe("When I click on new bill button", () => {

    test("Then I should navigate to new bill page", () => {
      const html = BillsUI({data:[]})
      document.body.innerHTML = html
      const handleClickNewBill = jest.fn(bills.handleClickNewBill)
      const btnNewBill = screen.getByTestId('btn-new-bill')
      btnNewBill.addEventListener('click', handleClickNewBill)
      userEvent.click(btnNewBill)
      expect(handleClickNewBill).toHaveBeenCalled()

    })

    describe("When I click on icon-eye", () => {
      test("Then opens modal", () => {
        const html = BillsUI({data:bills})
        document.body.innerHTML = html
        const handleClickIconEye = jest.fn(bills.handleClickIconEye)
        const eye = screen.getAllByTestId('icon-eye')[0]
        eye.addEventListener('click', handleClickIconEye)
        userEvent.click(eye)
        expect(handleClickIconEye).toHaveBeenCalled()

        const modale = screen.getByTestId('modaleFile')
        expect(modale).toBeTruthy()
      })
    })
  })
})

// test d'intégration GET
// à revoir

describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to the bills", async () => {

    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "get")
      const bills = await firebase.get()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(4)
    })

    test("fetches bills from an API and fails with 404 message error", async () => {
      // TypeError: _firebase.default.get.mockImplementationOnce is not a function
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