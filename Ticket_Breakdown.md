# Ticket Breakdown
We are a staffing company whose primary purpose is to book Agents at Shifts posted by Facilities on our platform. We're working on a new feature which will generate reports for our client Facilities containing info on how many hours each Agent worked in a given quarter by summing up every Shift they worked. Currently, this is how the process works:

- Data is saved in the database in the Facilities, Agents, and Shifts tables
- A function `getShiftsByFacility` is called with the Facility's id, returning all Shifts worked that quarter, including some metadata about the Agent assigned to each
- A function `generateReport` is then called with the list of Shifts. It converts them into a PDF which can be submitted by the Facility for compliance.

## You've been asked to work on a ticket. It reads:

**Currently, the id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**


Based on the information given, break this ticket down into 2-5 individual tickets to perform. Provide as much detail for each ticket as you can, including acceptance criteria, time/effort estimates, and implementation details. Feel free to make informed guesses about any unknown details - you can't guess "wrong".


You will be graded on the level of detail in each ticket, the clarity of the execution plan within and between tickets, and the intelligibility of your language. You don't need to be a native English speaker, but please proof-read your work.

## Your Breakdown Here

[STORY] **The id of each Agent on the reports we generate is their internal database id. We'd like to add the ability for Facilities to save their own custom ids for each Agent they work with and use that id when generating reports for them.**

1. Create Facility-Agents table to map Agents to map between `Agent.ID` and `FacilityAgent.ID`.
   - Table should contain `Facility.ID` (primary key of `Facility` table), `Agent.ID` (primary key of `Agent` table), and `FacilityAgentID`
   - FacilityAgentID should be string/char (length limit to be determined, but be prepared to accept at least 256 chars, unlimited, if feasible)
   - Apply indices for `Facility.ID` and `Facility.ID`-`Agent.ID`
   - Test SLA targets to handle at least 5000 Facility records, 500000 Agents, ensuring that 20% of agents report to more than a single facility
   - Time: 3.5 days (incl load testing)

2. Update entity and domain objects to accommodate new DB and fields [dependency on [1]]
   - Include data validation (as necessary)
   - Include unit tests
   - Time: 2 days

3. Create CRUD functions for FacilityAgentID settings [dependency on [2]]
   - Create/update `setAgentFacilityID(facilityID, agentId, facilityAgentID: FacilityAgentID)` and `setAgentFacilityIDs(facilityID, { agentId: facilityAgentID }[] )`
   - Delete `deleteAgentFacilityID(facilityID, facilityAgentID)` and `deleteAgentFacilityIDs(facilityID, facilityAgentIDs: FacilityAgentID[])`
     and `deleteAgentFacilityIDByAgentID(facilityID, AgentID)` and `deleteAgentFacilityIDByAgentIDs(facilityID, AgentIDs: FacilityAgentID[])`
   - Get `getAgentFacilityID(facilityID, agentId)` and `getAgentFacilityIDs(facilityID, agentIDs: AgentID[] ): FacilityAgentID[]`
   - Test SLA targets to map 500000 ensuring
     - Retrieval of a single facility of 500000 can be retrieved in 1000ms
     - Retrieval of 5000 facilities of agents between 1-3000 can be retrieved in 200ms, each
     - Defining 5000 FacilityAgentIDs for a single Facility can be performed within 1000ms
   - Time: 4 days (including PR and unit tests)

4. Update `getShiftsByFacility()` [dependency on [3]]
   - Add option to return Agent IDs as FacilityAgent.ID
   - If `FacilityAgent.ID` is selected, map `Agent.ID`s to `FacilityAgent.ID`. See `getAgentFacilityID`* functions in ticket[2]
   - Time: 2 days (PR and unit tests)

5. Update `generateReport()` [dependency on [3]]
   - Add option to display Agent IDs as FacilityAgent.ID
   - If `FacilityAgent.ID` is selected, map `Agent.ID`s to `FacilityAgent.ID`. See `getAgentFacilityID`* functions in ticket[2]
   - Time: 2 days (PR and unit tests)