import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
  constructor({ document, onNavigate, firestore, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.firestore = firestore
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", (e) => this.handleSubmit(e))
    const file = this.document.querySelector(`input[data-testid="file"]`)
    const error = this.document.createElement('div')
    error.classList.add('error')
    error.dataset.testid = 'errorMessage'
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
    // Bug 3
    //si extension est différente de jpg, jpeg ou png => erreur
    const fileName = fileDetails.name
    const extension = fileName.split(".").pop()
    const error = this.document.querySelector('.error')
    if(extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
      this.firestore
        .storage
        .ref(`justificatifs/${fileDetails.name}`)
        .put(fileDetails)
        .then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          this.fileUrl = url
          this.fileName = fileDetails.name
        })
      error.style.display = "none"
      console.log('ok', file)
    } else {
      console.log('error', file)
      error.style.display = "block"
      file.value = ""
    }
  }
  handleSubmit(e) {
    e.preventDefault()
    // console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
    const email = JSON.parse(localStorage.getItem("user")).email
    const bill = {
      email,
      type: document.querySelector(`select[data-testid="expense-type"]`).value,
      name:  document.querySelector(`input[data-testid="expense-name"]`).value,
      amount: parseInt(document.querySelector(`input[data-testid="amount"]`).value),
      date:  document.querySelector(`input[data-testid="datepicker"]`).value,
      vat: document.querySelector(`input[data-testid="vat"]`).value,
      pct: parseInt(document.querySelector(`input[data-testid="pct"]`).value) || 20,
      commentary: document.querySelector(`textarea[data-testid="commentary"]`).value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    }
    this.createBill(bill)
    this.onNavigate(ROUTES_PATH['Bills'])
  }

  // not need to cover this function by tests
  /* istanbul ignore next */
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