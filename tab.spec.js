import { CTRListPage } from "../../ctr-manager/page-classes/ctr-list"
import { DueDiligence } from '../page-classes/due-diligence-page'

describe('Activity Overview Details for CTR', () => {
    let ctrListPage
    let ddmPage
    let url='/BAMPlus/CTRManagerPlus/CtrDetail/'

    
    beforeEach(() => {
        cy.wait(1000)
    })

    it('C6370826: Activity Overview Details for CTR', () => {
        cy.wait(1000)
        ctrListPage = new CTRListPage()
        ctrListPage.waitForLoadingText()
        ctrListPage.clickStatusDropdown()
        ctrListPage.clearStatusDropdown()
        ctrListPage.clickSelectAllStatusDropdown()
        ctrListPage.clickSearchButton()
        ctrListPage.ctrListTableSortingByTransactionDateDesc()
        ctrListPage.findCtrListGridValueByColumn('PrimaryConductorTin').then((tinNumber) => {
            ddmPage = new DueDiligence()
            ddmPage.searchIdNumber(tinNumber)
            ddmPage.clickSearchButton()
            let portfolioDetail=ddmPage.clickOnPortfolio(0)
            ddmPage.getTextCtrsNumber().should('be.visible')
            ddmPage.getTextCtrsNumber().invoke('text').then((ctrCountValue) => {
                ddmPage.getTextIdType().then((IdType) => {
                    const tinCode = IdType.trim()
                    ddmPage.clickCtrCountLink()
                    portfolioDetail.verfiyArrowIcon(3)
                    portfolioDetail.verfiyGridExist(0)
                    portfolioDetail.getAction(3).click()
                    portfolioDetail.verfiyGridNotExist()
                    portfolioDetail.getAction(3).click()
                    portfolioDetail.verifyCTRColumnName()
                    portfolioDetail.verifyHyperlink('CtrId')
                    TestTool.wrap(portfolioDetail.getId('CtrId',0)).then(($ctrId) =>{
                        TestTool.wrap(portfolioDetail.getStatus('CtrStatusName',0)).then(($ctrStatus) =>{
                            portfolioDetail.clickCtrId(0)
                            portfolioDetail.verifyCtrUrl(url)
                            portfolioDetail.verifyCtrId($ctrId)
                            portfolioDetail.verifyCtrStatus($ctrStatus)
                        // ctrListPage.validateCtrTableData(ctrCountValue, 'PrimaryConductorTin')
                        // ctrListPage.validateCtrTableData(ctrCountValue, 'PrimaryBeneficiaryTin')
                        // ctrListPage.validatePrimaryBeneficiaryTin(tinNumber)
                        // ctrListPage.validatePrimaryBeneficiaryTinCode(tinCode)
                        })
                    })
                })
            })

        })
    })

})
