import {EventManagerPage} from "../../page-classes/event-manager-page";
import {FraudBaseClass} from "../../page-classes/base-class";
import {Table} from "../../page-classes/tables/table";
import {Drawer} from "../../page-classes/drawers/drawer";
import {
  ColumnId, DecisionStatus, DepositDeclineReasons,
  InClearingApproveReasons, InClearingDeclineReasons, User
} from "../../page-classes/fraud-data";
import {Modal} from "../../page-classes/modals/modal";
import {UserAdd} from "../../../security-manager/page-classes/user-add-page";

describe('Check Analysis Analyst role', () => {
  let eventPage, baseClass, table, drawer, eventNumber, modal, userAdd
  let transactionType = 'Check In-Clearing'
  let approveComment = 'Approving checks with test comment'
  let declineComment = 'Declining checks with test comment'
  let reassignComment = 'Reassigning checks with test comment'
  let changeDecisionComment = 'Changed my mind, updating to declined'
  let retroActiveFraudComment = 'Marking event as retroactive fraud'
  const roles = [{name: 'Fraud+Events', role: 313}] // 313 is roleID for Check Analysis Analyst
  let row = 0

  it('C5439578 Check Analysis Analyst role', () => {
    userAdd = new UserAdd()
    userAdd.createUserAndLogin(roles)
    // Open Transaction list page
    eventPage = new EventManagerPage(true, false)
    baseClass = new FraudBaseClass()
    table = new Table()
    drawer = new Drawer()
    modal = new Modal()
    baseClass.waitForLoading()
    // Filter event with in-Clearing
    table.clickOnFilterDropdown(table.filter.transactionTypeInputBox)
    baseClass.forceClickSelector(table.filter.transactionTypeDropdownOption(transactionType))
    baseClass.clickSelector(table.filter.searchButton)
    baseClass.waitForLoading()
    // Validate approve, decline and reassign button do not exist
    baseClass.verifySelectorDoesNotExist(table.actions.approveButton)
    baseClass.verifySelectorDoesNotExist(table.actions.declineButton)
    baseClass.verifySelectorDoesNotExist(table.actions.reassignButton)
    table.getRowCell(ColumnId.eventId, row).then($value => {
      eventNumber = $value.text().trim()
      // Open First Event
      table.clickEventNumberOnRow(row)
      baseClass.waitForLoading()
      // Approve event
      baseClass.clickSelector(drawer.header.approveButton)
      baseClass.clickSelector(modal.approveModal.reason)
      baseClass.clickSelector(modal.approveModal.reasonDropdown(InClearingApproveReasons.allDetailsMatchUponAnalystReview))
      baseClass.typeInput(modal.approveModal.inClearingComment, approveComment)
      baseClass.clickSelector(modal.approveModal.approveButton)
      // Verify modal is closed and toast message is displayed
      baseClass.verifySelectorContains(baseClass.toast.success, `Event #${eventNumber} has been approved`)
      baseClass.verifySelectorIsNotVisible(modal.approveModal.modal)
      // Search for eventID and verify that event is not found
      baseClass.typeInput(table.filter.eventNumberInputBox, eventNumber)
      baseClass.clickSelector(table.filter.searchButton)
      baseClass.waitForLoading()
      baseClass.verifySelectorExistAndVisible(table.table.noRecordsFound)
      // Go to decision history
      baseClass.clickSelector(eventPage.tab.decisionHistoryTab)
      baseClass.verifySelectorExistAndVisible(table.table.decisionHistoryTable)
      baseClass.waitForLoading()
      // Filter to in-clearing only
      table.clickOnFilterDropdown(table.filter.transactionTypeInputBox)
      baseClass.forceClickSelector(table.filter.transactionTypeDropdownOption(transactionType))
      baseClass.clickSelector(table.filter.searchButton)
      baseClass.waitForLoading()
      // Search for eventID
      baseClass.typeInput(table.filter.eventNumberInputBox, eventNumber)
      baseClass.clickSelector(table.filter.searchButton)
      baseClass.waitForLoading()
      // Verify event is found and decision status is approved
      table.verifyAllRowCellForColumnHasRightValue(ColumnId.eventId, eventNumber)
      table.verifyAllRowCellForColumnHasRightValue(ColumnId.eventStatus, DecisionStatus.decisionHistory[0])
    })
// Decline Scenario
    // Go back to Transaction list table
    baseClass.clickSelector(eventPage.tab.transactionListTab)
    baseClass.verifySelectorExistAndVisible(table.table.transactionListTable)
    baseClass.waitForLoading()
    // Filter event with in-Clearing
    table.clickOnFilterDropdown(table.filter.transactionTypeInputBox)
    baseClass.forceClickSelector(table.filter.transactionTypeDropdownOption(transactionType))
    baseClass.clickSelector(table.filter.searchButton)
    baseClass.waitForLoading()
    table.getRowCell(ColumnId.eventId, row).then($value => {
      eventNumber = $value.text().trim()
      // Open First Event
      table.clickEventNumberOnRow(row)
      baseClass.waitForLoading()
      // Decline event
      baseClass.clickSelector(drawer.header.declineButton)
      baseClass.clickSelector(modal.declineModal.reason)
      baseClass.clickSelector(modal.declineModal.reasonDropdown(InClearingDeclineReasons.alteredCheck))
      baseClass.typeInput(modal.declineModal.inClearingComment, declineComment)
      baseClass.clickSelector(modal.declineModal.declineButton)
      // Verify modal is closed and toast message is displayed
      baseClass.verifySelectorContains(baseClass.toast.success, `Event #${eventNumber} has been declined`)
      baseClass.verifySelectorIsNotVisible(modal.declineModal.modal)
      // Search for eventID and verify that event is not found
      baseClass.typeInput(table.filter.eventNumberInputBox, eventNumber)
      baseClass.clickSelector(table.filter.searchButton)
      baseClass.waitForLoading()
      baseClass.verifySelectorExistAndVisible(table.table.noRecordsFound)
      // Go to decision history
      baseClass.clickSelector(eventPage.tab.decisionHistoryTab)
      baseClass.verifySelectorExistAndVisible(table.table.decisionHistoryTable)
      baseClass.waitForLoading()
      // Filter to in-clearing only
      table.clickOnFilterDropdown(table.filter.transactionTypeInputBox)
      baseClass.forceClickSelector(table.filter.transactionTypeDropdownOption(transactionType))
      baseClass.clickSelector(table.filter.searchButton)
      baseClass.waitForLoading()
      // Search for eventID
      baseClass.typeInput(table.filter.eventNumberInputBox, eventNumber)
      baseClass.clickSelector(table.filter.searchButton)
      baseClass.waitForLoading()
      // Verify event is found and decision status is declined
      table.verifyAllRowCellForColumnHasRightValue(ColumnId.eventId, eventNumber)
      table.verifyAllRowCellForColumnHasRightValue(ColumnId.eventStatus, DecisionStatus.decisionHistory[1])
    })
// Reassign Scenario
    // Go back to Transaction list table
    baseClass.clickSelector(eventPage.tab.transactionListTab)
    baseClass.verifySelectorExistAndVisible(table.table.transactionListTable)
    baseClass.waitForLoading()
    // Filter event with in-Clearing
    table.clickOnFilterDropdown(table.filter.transactionTypeInputBox)
    baseClass.forceClickSelector(table.filter.transactionTypeDropdownOption(transactionType))
    baseClass.clickSelector(table.filter.searchButton)
    baseClass.waitForLoading()
    table.getRowCell(ColumnId.eventId, row).then($value => {
      eventNumber = $value.text().trim()
      // Open First Event
      table.clickEventNumberOnRow(row)
      baseClass.waitForLoading()
      // Decline event
      baseClass.clickSelector(drawer.header.reassignButton)
      baseClass.forceClickSelector(modal.reassignModal.reassignOption)
      baseClass.clickSelector(modal.reassignModal.reassignDropdown(User.SuperAdmin))
      baseClass.typeInput(modal.reassignModal.inClearingComment, reassignComment)
      baseClass.clickSelector(modal.reassignModal.reassignButton)
      // Verify modal is closed and toast message is displayed
      baseClass.verifySelectorContains(baseClass.toast.success, `Event #${eventNumber} has been reassigned to ${User.SuperAdmin}.`)
      baseClass.verifySelectorIsNotVisible(modal.reassignModal.modal)
      // Search for eventID and verify assigned user
      baseClass.typeInput(table.filter.eventNumberInputBox, eventNumber)
      baseClass.clickSelector(table.filter.searchButton)
      baseClass.waitForLoading()
      table.verifyAllRowCellForColumnHasRightValue(ColumnId.assignedToFullName, User.SuperAdmin)
    })
// Change Decision Scenario
    // Go to decision history
    baseClass.clickSelector(eventPage.tab.decisionHistoryTab)
    baseClass.verifySelectorExistAndVisible(table.table.decisionHistoryTable)
    baseClass.waitForLoading()
    // Filter to in-clearing only
    table.clickOnFilterDropdown(table.filter.transactionTypeInputBox)
    baseClass.forceClickSelector(table.filter.transactionTypeDropdownOption(transactionType))
    // Verify Expired - assumes Expired event exist
    table.clickOnFilterDropdown(table.filter.decisionStatusInputBox)
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Auto-Approved'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Analyst-Declined'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Auto-Declined'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Retroactive Fraud'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Expired'))
    baseClass.verifySelectorHasAttributeValue(table.filter.decisionStatusDropdownOption('Analyst-Approved'), 'aria-selected', 'true')
    baseClass.clickSelector(table.filter.searchButton)
    baseClass.waitForLoading()
    table.getRowCell(ColumnId.eventId, row).then($value => {
      eventNumber = $value.text().trim()
      // Open First Event
      table.clickEventNumberOnRow(row)
      baseClass.waitForLoading()
      // Change decision to decline
      baseClass.getElementContains(drawer.header.changeDecisionDeclineButton, 'Change Decision: Decline').click()
      baseClass.clickSelector(modal.declineModal.reason)
      baseClass.clickSelector(modal.declineModal.reasonDropdown(DepositDeclineReasons.alteredCheck))
      baseClass.typeInput(modal.declineModal.inClearingComment, changeDecisionComment)
      baseClass.clickSelector(modal.declineModal.declineButton)
      baseClass.verifySelectorContains(baseClass.toast.success, `Event #${eventNumber} has been declined.`)
      baseClass.verifySelectorDoesNotExist(drawer.drawer.drawerBody)
      baseClass.waitForLoading()
      // Search for eventID
      baseClass.clickSelector(table.filter.clearButton)
      baseClass.waitForLoading()
      baseClass.typeInput(table.filter.eventNumberInputBox, eventNumber)
      baseClass.clickSelector(table.filter.searchButton)
      baseClass.waitForLoading()
      // Verify event is found and decision status is declined
      table.verifyAllRowCellForColumnHasRightValue(ColumnId.eventId, eventNumber)
      table.verifyAllRowCellForColumnHasRightValue(ColumnId.eventStatus, DecisionStatus.decisionHistory[1])
    })
// retroactive fraud Scenario
    // Verify Expired - assumes Expired event exist
    baseClass.clickSelector(table.filter.clearButton)
    baseClass.waitForLoading()
    table.clickOnFilterDropdown(table.filter.decisionStatusInputBox)
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Analyst-Approved'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Auto-Approved'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Analyst-Declined'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Auto-Declined'))
    baseClass.clickSelector(table.filter.decisionStatusDropdownOption('Retroactive Fraud'))
    baseClass.verifySelectorHasAttributeValue(table.filter.decisionStatusDropdownOption('Expired'), 'aria-selected', 'true')
    // Filter event with in-Clearing
    table.clickOnFilterDropdown(table.filter.transactionTypeInputBox)
    baseClass.forceClickSelector(table.filter.transactionTypeDropdownOption(transactionType))
    baseClass.clickSelector(table.filter.searchButton)
    baseClass.waitForLoading()
    table.getRowCell(ColumnId.eventId, row).then($value => {
      eventNumber = $value.text().trim()
      // Open First Event
      table.clickEventNumberOnRow(row)
      baseClass.waitForLoading()
      // Set as retroactive fraud
      baseClass.clickSelector(drawer.header.retroactiveFraudButton)
      baseClass.typeInput(modal.retroactiveFraudModal.comment, retroActiveFraudComment)
      baseClass.clickSelector(modal.retroactiveFraudModal.retroactiveFraudButton)
      baseClass.verifySelectorContains(baseClass.toast.success, 'Retroactive Fraud Applied Successfully')
      baseClass.verifySelectorIsNotVisible(modal.retroactiveFraudModal.modal)
      baseClass.verifySelectorDoesNotExist(drawer.drawer.drawerBody)
      baseClass.waitForLoading()
      // Search for eventID
      baseClass.clickSelector(table.filter.clearButton)
      baseClass.waitForLoading()
      baseClass.typeInput(table.filter.eventNumberInputBox, eventNumber)
      baseClass.clickSelector(table.filter.searchButton)
      baseClass.waitForLoading()
      // Verify event is found and decision status is declined
      table.verifyAllRowCellForColumnHasRightValue(ColumnId.eventId, eventNumber)
      table.verifyAllRowCellForColumnHasRightValue(ColumnId.eventStatus, DecisionStatus.decisionHistory[6])
    })
// Validate setting tab is not visible
    baseClass.verifySelectorDoesNotExist(eventPage.tab.settingsTab)
  })
})
