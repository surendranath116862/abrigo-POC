import {EventManagerPage} from "../../page-classes/event-manager-page";
import {FraudBaseClass} from "../../page-classes/base-class";
import {Table} from "../../page-classes/tables/table";
import {Drawer} from "../../page-classes/drawers/drawer";
import {Modal} from "../../page-classes/modals/modal";
import {UserAdd} from "../../../security-manager/page-classes/user-add-page";

describe('Check Analysis View-Only role', () => {
  let eventPage, baseClass, table, drawer, modal, userAdd
  const roles = [{name: 'Fraud+Events', role: 314}] // 314 is roleID for Check Analysis Analyst (View-Only)
  let row = 0

  it('C5439579 Check Analysis View-Only role', () => {
    userAdd = new UserAdd()
    userAdd.createUserAndLogin(roles)
    // Open Transaction list page
    eventPage = new EventManagerPage(true, false)
    baseClass = new FraudBaseClass()
    table = new Table()
    drawer = new Drawer()
    modal = new Modal()
    baseClass.waitForLoading()
    // Validate approve, decline and reassign button do not exist in table
    baseClass.verifySelectorDoesNotExist(table.actions.approveButton)
    baseClass.verifySelectorDoesNotExist(table.actions.declineButton)
    baseClass.verifySelectorDoesNotExist(table.actions.reassignButton)
    // Open first event
    table.clickEventNumberOnRow(row)
    baseClass.waitForLoading()
    // Validate approve, decline and reassign button do not exist in drawer
    baseClass.verifySelectorDoesNotExist(drawer.header.approveButton)
    baseClass.verifySelectorDoesNotExist(drawer.header.declineButton)
    baseClass.verifySelectorDoesNotExist(drawer.header.reassignButton)
    // Close event drawer
    baseClass.clickSelector(drawer.header.closeDrawerButton)
    // Go to decision history
    baseClass.clickSelector(eventPage.tab.decisionHistoryTab)
    baseClass.verifySelectorExistAndVisible(table.table.decisionHistoryTable)
    baseClass.waitForLoading()
    // Filter for recently approved and declined events
    table.clickOnFilterDropdown(table.filter.decisionStatusInputBox)
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Analyst-Declined'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Auto-Declined'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Retroactive Fraud'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Expired'))
    baseClass.verifySelectorHasAttributeValue(table.filter.decisionStatusDropdownOption('Auto-Approved'), 'aria-selected', 'true')
    baseClass.verifySelectorHasAttributeValue(table.filter.decisionStatusDropdownOption('Analyst-Approved'), 'aria-selected', 'true')
    baseClass.clickSelector(table.filter.searchButton)
    baseClass.waitForLoading()
    // Open first event
    table.clickEventNumberOnRow(row)
    baseClass.waitForLoading()
    // Validate approve, decline and reassign button do not exist in table
    baseClass.verifySelectorDoesNotExist(drawer.header.changeDecisionApproveButton)
    baseClass.verifySelectorDoesNotExist(drawer.header.changeDecisionDeclineButton)
    // Close event drawer
    baseClass.clickSelector(drawer.header.closeDrawerButton)
    // Filter for Expired and Historical events
    baseClass.clickSelector(table.filter.clearButton)
    baseClass.waitForLoading()
    table.clickOnFilterDropdown(table.filter.decisionStatusInputBox)
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Analyst-Approved'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Auto-Approved'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Analyst-Declined'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Auto-Declined'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Retroactive Fraud'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Historical'))
    baseClass.verifySelectorHasAttributeValue(table.filter.decisionStatusDropdownOption('Expired'), 'aria-selected', 'true')
    baseClass.verifySelectorHasAttributeValue(table.filter.decisionStatusDropdownOption('Historical'), 'aria-selected', 'true')
    // Open first event
    table.clickEventNumberOnRow(row)
    baseClass.waitForLoading()
    // Validate retroactive button do not exist in table
    baseClass.verifySelectorDoesNotExist(drawer.header.retroactiveFraudButton)
    // Validate setting tab is not visible
    baseClass.verifySelectorDoesNotExist(eventPage.tab.settingsTab)
  })
})
