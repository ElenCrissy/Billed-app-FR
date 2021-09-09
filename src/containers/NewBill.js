
import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    const error = this.document.createElement('div')
    error.classList.add('error')
    error.appendChild(this.document.createTextNode('Seuls les fichiers .jpg, .jpeg, .png sont valides.'))
    file.parentNode.insertBefore(error, file.nextSibling)
    error.style.display = "none"
    // file.accept = ".jpg, .jpeg, .png"
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    new Logout({ document, localStorage, onNavigate })
  }
  handleChangeFile = e => {
    const file = this.document.querySelector(`input[data-testid="file"]`)
    const fileDetails = this.document.querySelector(`input[data-testid="file"]`).files[0]
    console.log(fileDetails)
    const filePath = e.target.value.split(/\\/g)
    let fileName = filePath[filePath.length-1]
    //si extension est différente de jpg, jpeg ou png => erreur
    const extension = fileName.split('.').pop()
    const error = this.document.querySelector('.error')
    if(extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
      this.firestore
      .storage
      .ref(`justificatifs/${fileName}`)
      .put(fileDetails)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => {
        this.fileUrl = url
        this.fileName = fileName
      })
      error.style.display = "none"
      console.log('ok')
    } else {
      console.log('erreur')
      error.style.display = "block"
      console.log(file.value)
      file.value =""
      console.log(fileDetails)
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
      name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
      date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
      vat: e.target.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.createBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  createBill = (bill) => {
    if (this.firestore) {
      this.firestore
      .bills()
      .add(bill)
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => error)
    }
  }
}