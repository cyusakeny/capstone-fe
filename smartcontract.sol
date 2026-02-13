// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// MAIN CONTRACT: Users, Reports, and Evidence

/**
 * @title CrimeReportingSystem
 * @dev Main contract for managing users, crime reports, and evidence
 */
contract CrimeReportingSystem {
    
    // ENUMS
    
    enum ReportStatus { PENDING, UNDER_INVESTIGATION, RESOLVED, CLOSED }
    
    // STRUCTS

    struct User {
        bytes32 userHash;
        string userId;
        uint256 registeredAt;
        bool isActive;
        bool isOfficer;
        bool exists;
    }
    
    struct Report {
        string reportId;
        bytes32 reporterHash;
        bytes32 reportHash;
        ReportStatus status;
        uint256 createdAt;
        uint256 lastUpdatedAt;
        uint256 accessCount;
        bool exists;
    }
    
    struct Evidence {
        string evidenceId;
        string reportId;
        bytes32 fileHash;
        string fileType;
        bytes32 uploadedByHash;
        uint256 uploadedAt;
        bool exists;
    }
    
    struct AccessLog {
        string accessId;
        string reportId;
        bytes32 accessedByHash;
        uint256 timestamp;
        string accessType;  // "view", "update", "download_evidence", etc.
    }
    
    // STATE VARIABLES
    
    // User mappings
    mapping(bytes32 => User) public users;
    mapping(string => bytes32) public userIdToHash;
    bytes32[] public allUserHashes;
    
    // Report mappings
    mapping(string => Report) public reports;
    mapping(bytes32 => string[]) public userReports;
    string[] public allReportIds;
    
    // Evidence mappings
    mapping(string => Evidence) public evidences;
    mapping(string => string[]) public reportEvidences;
    string[] public allEvidenceIds;
    
    // Access log mappings
    mapping(string => AccessLog) public accessLogs;
    mapping(string => string[]) public reportAccessLogs;  // reportId => accessIds
    mapping(bytes32 => string[]) public userAccessLogs;   // userHash => accessIds
    string[] public allAccessLogIds;
    
    // Contract owner
    address public owner;
    
    
    // EVENTS
    
    // User events
    event UserRegistered(bytes32 indexed userHash, string userId, uint256 timestamp);
    event UserDeactivated(bytes32 indexed userHash, uint256 timestamp);
    event UserActivated(bytes32 indexed userHash, uint256 timestamp);
    event OfficerStatusChanged(bytes32 indexed userHash, bool isOfficer, uint256 timestamp);
    
    // Report events
    event ReportCreated(
        string indexed reportId, 
        bytes32 indexed reporterHash, 
        bytes32 reportHash, 
        uint256 timestamp
    );
    
    event ReportStatusUpdated(
        string indexed reportId, 
        ReportStatus oldStatus, 
        ReportStatus newStatus, 
        bytes32 indexed updatedByHash,
        uint256 timestamp
    );
    
    event ReportHashUpdated(
        string indexed reportId, 
        bytes32 oldHash, 
        bytes32 newHash, 
        uint256 timestamp
    );
    
    event ReportAccessed(
        string indexed reportId,
        bytes32 indexed accessedByHash,
        string accessType,
        uint256 timestamp
    );
    
    // Evidence events
    event EvidenceAdded(
        string indexed evidenceId,
        string indexed reportId,
        bytes32 fileHash,
        string fileType,
        bytes32 indexed uploadedByHash,
        uint256 timestamp
    );
    
    event EvidenceVerified(
        string indexed evidenceId,
        bool isValid,
        uint256 timestamp
    );
    
    // System events
    event AuditContractSet(address indexed auditContract, uint256 timestamp);
    
    // ============================================================================
    // MODIFIERS
    // ============================================================================
    

    modifier userExists(bytes32 _userHash) {
        require(users[_userHash].exists, "User does not exist");
        _;
    }
    
    modifier onlyActiveUser(bytes32 _userHash) {
        require(users[_userHash].isActive, "User not active");
        _;
    }
    
    modifier onlyRegisteredUser(bytes32 _userHash) {
        require(users[_userHash].exists, "User not registered");
        require(users[_userHash].isActive, "User account is not active");
        _;
    }
    
    modifier reportExists(string memory _reportId) {
        require(reports[_reportId].exists, "Report does not exist");
        _;
    }
    
    modifier evidenceExists(string memory _evidenceId) {
        require(evidences[_evidenceId].exists, "Evidence does not exist");
        _;
    }
    
    // ============================================================================
    // CONSTRUCTOR
    // ============================================================================
    
    constructor() {
        owner = msg.sender;
    }

    // USER MANAGEMENT FUNCTIONS
    
    function registerUser(bytes32 _userHash, string memory _userId) external {
        require(!users[_userHash].exists, "User already registered");
        require(userIdToHash[_userId] == bytes32(0), "User ID already exists");
        require(_userHash != bytes32(0), "Invalid user hash");
        
        users[_userHash] = User({
            userHash: _userHash,
            userId: _userId,
            registeredAt: block.timestamp,
            isActive: true,
            isOfficer: false,
            exists: true
        });
        
        userIdToHash[_userId] = _userHash;
        allUserHashes.push(_userHash);
        
        emit UserRegistered(_userHash, _userId, block.timestamp);
    }
    
    function setOfficerStatus(bytes32 _userHash, bool _isOfficer) 
        external 
        userExists(_userHash)
        onlyActiveUser(_userHash) 
    {
        users[_userHash].isOfficer = _isOfficer;
        emit OfficerStatusChanged(_userHash, _isOfficer, block.timestamp);
    }
    
    function deactivateUser(bytes32 _userHash) external  userExists(_userHash) {
        users[_userHash].isActive = false;
        emit UserDeactivated(_userHash, block.timestamp);
    }
    
    function activateUser(bytes32 _userHash) external  userExists(_userHash) {
        users[_userHash].isActive = true;
        emit UserActivated(_userHash, block.timestamp);
    }
    
    function isUserRegistered(bytes32 _userHash) external view returns (bool) {
        return users[_userHash].exists;
    }
    
    function isUserOfficer(bytes32 _userHash) external view returns (bool) {
        return users[_userHash].isOfficer;
    }
    
    function isActiveUser(bytes32 _userHash) external view returns (bool) {
        return users[_userHash].exists && users[_userHash].isActive;
    }
    
    function getUserByHash(bytes32 _userHash) 
        external 
        view 
        userExists(_userHash)
        returns (
            bytes32 userHash,
            string memory userId,
            uint256 registeredAt,
            bool isActive,
            bool isOfficer
        ) 
    {
        User memory user = users[_userHash];
        return (
            user.userHash,
            user.userId,
            user.registeredAt,
            user.isActive,
            user.isOfficer
        );
    }
    
    function getUserHashByUserId(string memory _userId) external view returns (bytes32) {
        return userIdToHash[_userId];
    }
    
    function getTotalUsers() external view returns (uint256) {
        return allUserHashes.length;
    }
    
    // REPORT MANAGEMENT FUNCTIONS
    
    function createReport(
        string memory _reportId,
        bytes32 _reporterHash,
        bytes32 _reportHash
    ) external onlyRegisteredUser(_reporterHash) {
        require(!reports[_reportId].exists, "Report already exists");
        require(_reportHash != bytes32(0), "Invalid report hash");
        
        reports[_reportId] = Report({
            reportId: _reportId,
            reporterHash: _reporterHash,
            reportHash: _reportHash,
            status: ReportStatus.PENDING,
            createdAt: block.timestamp,
            lastUpdatedAt: block.timestamp,
            accessCount: 0,
            exists: true
        });
        
        userReports[_reporterHash].push(_reportId);
        allReportIds.push(_reportId);
        
        emit ReportCreated(_reportId, _reporterHash, _reportHash, block.timestamp);
    }
    
    function updateReportStatus(
        string memory _reportId,
        bytes32 _updatedByHash,
        ReportStatus _newStatus
    ) external reportExists(_reportId) onlyRegisteredUser(_updatedByHash) {
        Report storage report = reports[_reportId];
        ReportStatus oldStatus = report.status;
        
        report.status = _newStatus;
        report.lastUpdatedAt = block.timestamp;
        
        // Log access when updating
        _logAccess(_reportId, _updatedByHash, "update_status");
        
        emit ReportStatusUpdated(_reportId, oldStatus, _newStatus, _updatedByHash, block.timestamp);
    }
    
    function accessReport(
        string memory _reportId,
        bytes32 _accessorHash,
        string memory _accessType
    ) external reportExists(_reportId) onlyRegisteredUser(_accessorHash) {
        _logAccess(_reportId, _accessorHash, _accessType);
    }
    
    function verifyReportIntegrity(
        string memory _reportId, 
        bytes32 _currentHash
    ) external view reportExists(_reportId) returns (bool) {
        return reports[_reportId].reportHash == _currentHash;
    }
    
    function getReport(string memory _reportId) 
        external 
        view 
        reportExists(_reportId) 
        returns (
            string memory reportId,
            bytes32 reporterHash,
            bytes32 reportHash,
            ReportStatus status,
            uint256 createdAt,
            uint256 lastUpdatedAt,
            uint256 accessCount
        ) 
    {
        Report memory report = reports[_reportId];
        return (
            report.reportId,
            report.reporterHash,
            report.reportHash,
            report.status,
            report.createdAt,
            report.lastUpdatedAt,
            report.accessCount
        );
    }
    
    function getUserReports(bytes32 _userHash) external view returns (string[] memory) {
        return userReports[_userHash];
    }
    
    function getTotalReports() external view returns (uint256) {
        return allReportIds.length;
    }
    
    function getReportsByStatus(ReportStatus _status) 
        external 
        view 
        returns (string[] memory) 
    {
        uint256 count = 0;
        
        for (uint256 i = 0; i < allReportIds.length; i++) {
            if (reports[allReportIds[i]].status == _status) {
                count++;
            }
        }
        
        string[] memory result = new string[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allReportIds.length; i++) {
            if (reports[allReportIds[i]].status == _status) {
                result[index] = allReportIds[i];
                index++;
            }
        }
        
        return result;
    }
    
    // ============================================================================
    // ACCESS LOG FUNCTIONS
    // ============================================================================
    
    function _logAccess(
        string memory _reportId,
        bytes32 _accessorHash,
        string memory _accessType
    ) internal {
        string memory accessId = _generateAccessId(_reportId, _accessorHash);
        
        accessLogs[accessId] = AccessLog({
            accessId: accessId,
            reportId: _reportId,
            accessedByHash: _accessorHash,
            timestamp: block.timestamp,
            accessType: _accessType
        });
        
        reportAccessLogs[_reportId].push(accessId);
        userAccessLogs[_accessorHash].push(accessId);
        allAccessLogIds.push(accessId);
        
        // Increment access count
        reports[_reportId].accessCount++;
        
        emit ReportAccessed(_reportId, _accessorHash, _accessType, block.timestamp);
    }
    
    function _generateAccessId(
        string memory _reportId,
        bytes32 _accessorHash
    ) internal view returns (string memory) {
        return string(abi.encodePacked(
            "access_",
            _reportId,
            "_accessor",
            _accessorHash,
            "_",
            _uint2str(block.timestamp)
        ));
    }
    
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        return string(bstr);
    }
    
    function getReportAccessLogs(string memory _reportId) 
        external 
        view 
        reportExists(_reportId)
        returns (string[] memory) 
    {
        return reportAccessLogs[_reportId];
    }
    
    function getUserAccessLogs(bytes32 _userHash) 
        external 
        view 
        returns (string[] memory) 
    {
        return userAccessLogs[_userHash];
    }
    
    function getAccessLog(string memory _accessId)
        external
        view
        returns (
            string memory accessId,
            string memory reportId,
            bytes32 accessedByHash,
            uint256 timestamp,
            string memory accessType
        )
    {
        AccessLog memory log = accessLogs[_accessId];
        require(bytes(log.accessId).length > 0, "Access log does not exist");
        return (
            log.accessId,
            log.reportId,
            log.accessedByHash,
            log.timestamp,
            log.accessType
        );
    }
    
    function getTotalAccessLogs() external view returns (uint256) {
        return allAccessLogIds.length;
    }
    
    function getReportAccessCount(string memory _reportId) 
        external 
        view 
        reportExists(_reportId)
        returns (uint256) 
    {
        return reports[_reportId].accessCount;
    }
    
    // EVIDENCE MANAGEMENT FUNCTIONS
    
    
    function addEvidence(
        string memory _evidenceId,
        string memory _reportId,
        bytes32 _fileHash,
        string memory _fileType,
        bytes32 _uploadedByHash
    ) external reportExists(_reportId) onlyRegisteredUser(_uploadedByHash) {
        require(!evidences[_evidenceId].exists, "Evidence already exists");
        require(_fileHash != bytes32(0), "Invalid file hash");
        
        evidences[_evidenceId] = Evidence({
            evidenceId: _evidenceId,
            reportId: _reportId,
            fileHash: _fileHash,
            fileType: _fileType,
            uploadedByHash: _uploadedByHash,
            uploadedAt: block.timestamp,
            exists: true
        });
        
        reportEvidences[_reportId].push(_evidenceId);
        allEvidenceIds.push(_evidenceId);
        
        // Log access when adding evidence
        _logAccess(_reportId, _uploadedByHash, "add_evidence");
        
        emit EvidenceAdded(_evidenceId, _reportId, _fileHash, _fileType, _uploadedByHash, block.timestamp);
    }
    
    function accessEvidence(
        string memory _evidenceId,
        bytes32 _accessorHash
    ) external evidenceExists(_evidenceId) onlyRegisteredUser(_accessorHash) {
        Evidence memory evidence = evidences[_evidenceId];
        _logAccess(evidence.reportId, _accessorHash, "view_evidence");
    }
    
    function verifyEvidenceIntegrity(
        string memory _evidenceId,
        bytes32 _currentHash
    ) external evidenceExists(_evidenceId) returns (bool) {
        bool isValid = evidences[_evidenceId].fileHash == _currentHash;
        emit EvidenceVerified(_evidenceId, isValid, block.timestamp);
        return isValid;
    }
    
    function getEvidence(string memory _evidenceId)
        external
        view
        evidenceExists(_evidenceId)
        returns (
            string memory evidenceId,
            string memory reportId,
            bytes32 fileHash,
            string memory fileType,
            bytes32 uploadedByHash,
            uint256 uploadedAt
        )
    {
        Evidence memory evidence = evidences[_evidenceId];
        return (
            evidence.evidenceId,
            evidence.reportId,
            evidence.fileHash,
            evidence.fileType,
            evidence.uploadedByHash,
            evidence.uploadedAt
        );
    }
    
    function getReportEvidences(string memory _reportId) 
        external 
        view 
        returns (string[] memory) 
    {
        return reportEvidences[_reportId];
    }
    
    function getTotalEvidences() external view returns (uint256) {
        return allEvidenceIds.length;
    }
}

// AUDIT CONTRACT: Audit Logs and Status Changes
/**
 * @title AuditLogSystem
 * @dev Separate contract for managing audit logs and status change history
 */
contract AuditLogSystem {
    
 
    // ENUMS

    
    enum ActionType { 
        REPORT_CREATED, 
        REPORT_VIEWED, 
        STATUS_UPDATED, 
        EVIDENCE_ADDED, 
        COMMENT_ADDED,
        REPORT_VERIFIED,
        USER_REGISTERED,
        EVIDENCE_VERIFIED,
        REPORT_ACCESSED,
        EVIDENCE_ACCESSED
    }
    
    enum ReportStatus { PENDING, UNDER_INVESTIGATION, RESOLVED, CLOSED }
    

    // STRUCTS
    
    struct AuditEntry {
        string logId;
        string reportId;
        ActionType actionType;
        bytes32 performedByHash;
        bytes32 detailsHash;
        uint256 timestamp;
        bool exists;
    }
    
    struct StatusChange {
        string changeId;
        string reportId;
        uint8 oldStatus;
        uint8 newStatus;
        bytes32 changedByHash;
        bytes32 reasonHash;
        uint256 timestamp;
        bool exists;
    }
    
    // STATE VARIABLES
    
    // Audit log mappings
    mapping(string => AuditEntry) public auditEntries;
    mapping(string => string[]) public reportAuditLog;
    mapping(bytes32 => string[]) public userAuditLog;
    string[] public allAuditLogIds;
    
    // Status change mappings
    mapping(string => StatusChange) public statusChanges;
    mapping(string => string[]) public reportStatusHistory;
    string[] public allStatusChangeIds;
    
    // Contract owner
    address public owner;
    
    // EVENTS
    
    event AuditEntryCreated(
        string indexed logId,
        string indexed reportId,
        ActionType actionType,
        bytes32 indexed performedByHash,
        bytes32 detailsHash,
        uint256 timestamp
    );
    
    event StatusChanged(
        string indexed changeId,
        string indexed reportId,
        uint8 oldStatus,
        uint8 newStatus,
        bytes32 indexed changedByHash,
        bytes32 reasonHash,
        uint256 timestamp
    );
    
    
    // MODIFIERS
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // CONSTRUCTOR
    
    constructor() {
        owner = msg.sender;
    }

    // AUDIT LOG FUNCTION
    
    function logAction(
        string memory _logId,
        string memory _reportId,
        ActionType _actionType,
        bytes32 _performedByHash,
        bytes32 _detailsHash
    ) external {
        require(!auditEntries[_logId].exists, "Audit entry already exists");
        require(_performedByHash != bytes32(0), "Invalid user hash");
        
        auditEntries[_logId] = AuditEntry({
            logId: _logId,
            reportId: _reportId,
            actionType: _actionType,
            performedByHash: _performedByHash,
            detailsHash: _detailsHash,
            timestamp: block.timestamp,
            exists: true
        });
        
        reportAuditLog[_reportId].push(_logId);
        userAuditLog[_performedByHash].push(_logId);
        allAuditLogIds.push(_logId);
        
        emit AuditEntryCreated(_logId, _reportId, _actionType, _performedByHash, _detailsHash, block.timestamp);
    }
    
    function getAuditEntry(string memory _logId)
        external
        view
        returns (
            string memory logId,
            string memory reportId,
            ActionType actionType,
            bytes32 performedByHash,
            bytes32 detailsHash,
            uint256 timestamp
        )
    {
        require(auditEntries[_logId].exists, "Audit entry does not exist");
        AuditEntry memory entry = auditEntries[_logId];
        return (
            entry.logId,
            entry.reportId,
            entry.actionType,
            entry.performedByHash,
            entry.detailsHash,
            entry.timestamp
        );
    }
    
    function getReportAuditTrail(string memory _reportId) 
        external 
        view 
        returns (string[] memory) 
    {
        return reportAuditLog[_reportId];
    }
    
    function getUserAuditTrail(bytes32 _userHash) 
        external 
        view 
        returns (string[] memory) 
    {
        return userAuditLog[_userHash];
    }
    
    function getTotalAuditEntries() external view returns (uint256) {
        return allAuditLogIds.length;
    }
    
    function getAuditEntriesByActionType(ActionType _actionType) 
        external 
        view 
        returns (string[] memory) 
    {
        uint256 count = 0;
        
        for (uint256 i = 0; i < allAuditLogIds.length; i++) {
            if (auditEntries[allAuditLogIds[i]].actionType == _actionType) {
                count++;
            }
        }
        
        string[] memory result = new string[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allAuditLogIds.length; i++) {
            if (auditEntries[allAuditLogIds[i]].actionType == _actionType) {
                result[index] = allAuditLogIds[i];
                index++;
            }
        }
        
        return result;
    }
    
    // STATUS CHANGE FUNCTIONS
    
    function logStatusChange(
        string memory _changeId,
        string memory _reportId,
        uint8 _oldStatus,
        uint8 _newStatus,
        bytes32 _changedByHash,
        bytes32 _reasonHash
    ) external {
        require(!statusChanges[_changeId].exists, "Status change already logged");
        require(_changedByHash != bytes32(0), "Invalid user hash");
        
        statusChanges[_changeId] = StatusChange({
            changeId: _changeId,
            reportId: _reportId,
            oldStatus: _oldStatus,
            newStatus: _newStatus,
            changedByHash: _changedByHash,
            reasonHash: _reasonHash,
            timestamp: block.timestamp,
            exists: true
        });
        
        reportStatusHistory[_reportId].push(_changeId);
        allStatusChangeIds.push(_changeId);
        
        emit StatusChanged(_changeId, _reportId, _oldStatus, _newStatus, _changedByHash, _reasonHash, block.timestamp);
    }
    
    function getStatusChange(string memory _changeId)
        external
        view
        returns (
            string memory changeId,
            string memory reportId,
            uint8 oldStatus,
            uint8 newStatus,
            bytes32 changedByHash,
            bytes32 reasonHash,
            uint256 timestamp
        )
    {
        require(statusChanges[_changeId].exists, "Status change does not exist");
        StatusChange memory change = statusChanges[_changeId];
        return (
            change.changeId,
            change.reportId,
            change.oldStatus,
            change.newStatus,
            change.changedByHash,
            change.reasonHash,
            change.timestamp
        );
    }
    
    function getReportStatusHistory(string memory _reportId) 
        external 
        view 
        returns (string[] memory) 
    {
        return reportStatusHistory[_reportId];
    }
    
    function getTotalStatusChanges() external view returns (uint256) {
        return allStatusChangeIds.length;
    }

}