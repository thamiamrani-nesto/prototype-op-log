// src/AuditTrailTable.jsx
import React, { useState } from "react";

// Import Material UI components using direct path imports from the installed package
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import TextField from "@mui/material/TextField";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import InputAdornment from "@mui/material/InputAdornment"; // Keep if using search icon
import { visuallyHidden } from "@mui/utils";
import SearchIcon from "@mui/icons-material/Search"; // Make sure @mui/icons-material is installed: npm install @mui/icons-material
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import { colors } from "@mui/material";

// --- Mock Data Generation ---
function createData(id, timestamp, user, action, property, oldValue, newValue) {
  return { id, timestamp, user, action, property, oldValue, newValue };
}
// Function to generate realistic mortgage-related mock data
function generateMortgageAuditData(count) {
  const data = [];
  const users = [
    "jane.underwriter",
    "system.processor",
    "applicant.eric",
    "manager.davis",
    "compliance.bot",
    "richard.underwriter",
    
  ];
  const actions = {
    create: ["Create Application", "Add Document", "Add Condition"],
    update: [
      "Update Status",
      "Update Loan Amount",
      "Update Interest Rate",
      "Update Property Value",
      "Assign Loan Officer",
      "Lock Rate",
      "Clear Condition",
      "Request Document",
      "Verify Income",
      "Order Appraisal",
    ],
    submit: ["Submit to Underwriting", "Submit for Funding"],
    decision: [
      "Approve Application",
      "Deny Application",
      "Approve with Conditions",
    ],
    delete: ["Cancel Application", "Withdraw Application"], // Less common in audit, but possible
  };
  const properties = {
    status: [
      "Application Status",
      "Underwriting Status",
      "Funding Status",
      "Condition Status",
      "Rate Lock Status",
    ],
    financial: [
      "Loan Amount",
      "Interest Rate",
      "Property Value",
      "Down Payment",
      "Estimated Closing Costs",
      "Borrower Income",
    ],
    docs: ["Document Type", "Document ID"],
    assignment: ["Assigned Loan Officer", "Assigned Underwriter"],
    conditions: ["Condition Text", "Condition ID"],
    misc: ["Property Address", "Loan Type", "Loan Term"],
  };
  const statuses = [
    "Received",
    "Processing",
    "Submitted",
    "Approved",
    "Denied",
    "Withdrawn",
    "Funded",
    "Conditions Pending",
    "Conditions Cleared",
    "Expired",
    "Locked",
    "Unlocked",
  ];
  const docTypes = [
    "Paystub",
    "Bank Statement",
    "Tax Return",
    "Appraisal Report",
    "Purchase Agreement",
    "ID",
  ];

  // Generate realistic timestamps in descending order
  let currentDate = new Date();

  for (let i = 1; i <= count; i++) {
    // Make timestamps slightly older for each row
    currentDate.setMinutes(
      currentDate.getMinutes() - Math.floor(Math.random() * 120 + 5)
    ); // Subtract 5-125 minutes
    const timestamp = currentDate.toISOString();
    const user = users[Math.floor(Math.random() * users.length)];

    let action = "";
    let property = "";
    let oldValue = "";
    let newValue = "";

    const actionType = [
      "create",
      "update",
      "update",
      "update",
      "submit",
      "decision",
      "delete",
    ][Math.floor(Math.random() * 7)]; // Skew towards updates

    switch (actionType) {
      case "create":
        action =
          actions.create[Math.floor(Math.random() * actions.create.length)];
        if (action === "Create Application") {
          property = "Application ID";
          newValue = `APP-${Math.floor(Math.random() * 90000 + 10000)}`;
        } else if (action === "Add Document") {
          property =
            properties.docs[Math.floor(Math.random() * properties.docs.length)];
          newValue = docTypes[Math.floor(Math.random() * docTypes.length)];
        } else {
          // Add Condition
          property = properties.conditions[0]; // Condition Text
          newValue = `Condition ${i}: Subject to appraisal.`;
        }
        oldValue = ""; // Creates have no old value
        break;

      case "submit":
        action =
          actions.submit[Math.floor(Math.random() * actions.submit.length)];
        property = properties.status[0]; // Application Status
        oldValue = "Processing";
        newValue = action.includes("Underwriting")
          ? "Submitted to Underwriting"
          : "Submitted for Funding";
        break;

      case "decision":
        action =
          actions.decision[Math.floor(Math.random() * actions.decision.length)];
        property = properties.status[1]; // Underwriting Status or App Status
        oldValue = "Submitted";
        newValue = action; // Action name itself is the new status
        break;

      case "delete":
        action =
          actions.delete[Math.floor(Math.random() * actions.delete.length)];
        property = properties.status[0]; // Application Status
        oldValue = ["Processing", "Submitted", "Approved"][
          Math.floor(Math.random() * 3)
        ];
        newValue = action.includes("Cancel") ? "Cancelled" : "Withdrawn";
        break;

      case "update": // Most common case
      default:
        action =
          actions.update[Math.floor(Math.random() * actions.update.length)];
        // Determine property based on action
        if (action.includes("Status")) {
          property =
            properties.status[
              Math.floor(Math.random() * properties.status.length)
            ];
          oldValue = statuses[Math.floor(Math.random() * statuses.length)];
          newValue = statuses[Math.floor(Math.random() * statuses.length)];
          while (oldValue === newValue) {
            // Ensure status actually changes
            newValue = statuses[Math.floor(Math.random() * statuses.length)];
          }
        } else if (action.includes("Loan Amount")) {
          property = properties.financial[0];
          oldValue = `${Math.floor(Math.random() * 300 + 150)}000`; // e.g., 150000 to 450000
          newValue = `${
            parseInt(oldValue) + (Math.random() > 0.5 ? 1 : -1) * 5000
          }`; // +/- 5k
        } else if (
          action.includes("Interest Rate") ||
          action.includes("Lock Rate")
        ) {
          property = properties.financial[1];
          oldValue = (Math.random() * 2 + 4.5).toFixed(3); // e.g., 4.500 to 6.500
          newValue = (
            parseFloat(oldValue) +
            (Math.random() > 0.5 ? 1 : -1) * 0.125
          ).toFixed(3); // +/- 0.125
          if (action.includes("Lock Rate")) {
            property = properties.status[4]; // Rate Lock Status
            oldValue = "Unlocked";
            newValue = "Locked";
          }
        } else if (
          action.includes("Property Value") ||
          action.includes("Appraisal")
        ) {
          property = properties.financial[2];
          oldValue = `${Math.floor(Math.random() * 400 + 200)}000`;
          newValue = `${
            parseInt(oldValue) + (Math.random() > 0.5 ? 1 : -1) * 10000
          }`; // +/- 10k
          if (action.includes("Appraisal")) {
            action = "Order Appraisal"; // Make action specific
            property = "Appraisal Status";
            oldValue = "Not Ordered";
            newValue = "Ordered";
          }
        } else if (action.includes("Loan Officer")) {
          property = properties.assignment[0];
          oldValue = users[Math.floor(Math.random() * users.length)];
          newValue = users[Math.floor(Math.random() * users.length)];
          while (oldValue === newValue) {
            newValue = users[Math.floor(Math.random() * users.length)];
          }
        } else if (action.includes("Condition")) {
          property = properties.status[3]; // Condition Status
          oldValue = "Pending";
          newValue = "Cleared";
        } else if (action.includes("Document")) {
          property = properties.docs[0]; // Document Type
          oldValue = "Requested";
          newValue =
            "Received - " +
            docTypes[Math.floor(Math.random() * docTypes.length)];
        } else if (action.includes("Verify Income")) {
          property = properties.financial[5]; // Borrower Income
          oldValue = "Pending Verification";
          newValue = "Verified";
        } else {
          // Fallback for other updates
          property =
            properties.misc[Math.floor(Math.random() * properties.misc.length)];
          oldValue = `Old Value ${i}`;
          newValue = `New Value ${i}`;
        }
        break;
    }

    data.push(
      createData(i, timestamp, user, action, property, oldValue, newValue)
    );
  }
  return data;
}

// Generate 90 rows of mock data using the new function
const initialRows = generateMortgageAuditData(36);
// Keep using the same mock data as before

// --- Sorting Helper Functions --- (Keep these exactly the same)
function descendingComparator(a, b, orderBy) {
  const valA = a[orderBy] ?? "";
  const valB = b[orderBy] ?? "";
  if (valB < valA) return -1;
  if (valB > valA) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// --- Table Header Configuration --- (Keep this exactly the same)
const headCells = [
  {
    id: "timestamp",
    numeric: false,
    disablePadding: false,
    label: "Timestamp",
  },
  { id: "user", numeric: false, disablePadding: false, label: "User" },
  { id: "action", numeric: false, disablePadding: false, label: "Action" },
  {
    id: "property",
    numeric: false,
    disablePadding: false,
    label: "Property/Field",
  },
  { id: "oldValue", numeric: false, disablePadding: false, label: "Old Value" },
  { id: "newValue", numeric: false, disablePadding: false, label: "New Value" },
];

// --- Enhanced Table Head Component --- (Keep this definition the same, using imported components)
function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: "#ffcd05" }}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: "bold", fontFamily: "Montserrat" }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {" "}
                  {/* Use imported visuallyHidden */}
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// --- Main Audit Trail Table Component --- (Keep this definition the same, using imported components)
function AuditTrailTable() {
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("timestamp");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dateRange, setDateRange] = React.useState({
    startDate: null,
    endDate: null
  });
  const [selectedUser, setSelectedUser] = React.useState(null);

  // Get unique users from the data
  const uniqueUsers = React.useMemo(() => {
    const users = new Set(initialRows.map(row => row.user));
    return Array.from(users).sort();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredRows = React.useMemo(() => {
    let filtered = initialRows;
    
    // Apply date range filter
    if (dateRange.startDate || dateRange.endDate) {
      filtered = filtered.filter(row => {
        const rowDate = new Date(row.timestamp);
        if (dateRange.startDate && rowDate < dateRange.startDate) return false;
        if (dateRange.endDate && rowDate > dateRange.endDate) return false;
        return true;
      });
    }
    
    // Apply user filter
    if (selectedUser) {
      filtered = filtered.filter(row => row.user === selectedUser);
    }
    
    // Apply search filter
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filtered = filtered.filter((row) => {
        return Object.values(row).some((value) =>
          String(value).toLowerCase().includes(lowercasedFilter)
        );
      });
    }
    
    return filtered;
  }, [searchTerm, dateRange, selectedUser]);

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredRows]
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0;

  return (
    <div sx={{ width: "100%", padding: 2 }}>
      <div className="tit">Applicant operation log</div>
      <Box>
        <Paper sx={{ width: "100%", mb: 2, boxShadow: "unset" }}>
          <Box sx={{ padding: 2 }}>
            <Grid container spacing={3} alignItems="center" >
              {/* <Grid item xs={12} sm={6} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={dateRange.startDate}
                      onChange={(newValue) => setDateRange(prev => ({ ...prev, startDate: newValue }))}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <Box sx={{ color: '#232142', fontWeight: 'bold', fontFamily: 'Montserrat' }}>-</Box>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={dateRange.endDate}
                      onChange={(newValue) => setDateRange(prev => ({ ...prev, endDate: newValue }))}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                  </LocalizationProvider>
                </Box>
              </Grid> */}
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  options={uniqueUsers}
                  value={selectedUser}
                  onChange={(event, newValue) => setSelectedUser(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Filter by User"
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: '300px',
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '50px',
                          height: '40px',
                          '& fieldset': {
                            borderColor: '#232142',
                          },
                          '&:hover fieldset': {
                            borderColor: '#232142',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#232142',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#232142',
                          fontFamily: 'Montserrat',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#232142',
                        },
                        '& .MuiInputBase-input': {
                          fontFamily: 'Montserrat',
                          padding: '8px 14px',
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Search"
                  variant="outlined"
                  placeholder="Search anything"
                  fullWidth
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                      height: '40px',
                      '& fieldset': {
                        borderColor: '#232142',
                      },
                      '&:hover fieldset': {
                        borderColor: '#232142',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#232142',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#232142',
                      fontFamily: 'Montserrat',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#232142',
                    },
                    '& .MuiInputBase-input': {
                      fontFamily: 'Montserrat',
                      padding: '8px 14px',
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>

          <TableContainer sx={{borderRadius: "30px"}}>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows.length > 0 ? (
                  visibleRows.map((row, index) => (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      sx={{
                        '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                        '&:first-of-type td:first-of-type': {
                          borderTopLeftRadius: '20px',
                        },
                        '&:first-of-type td:last-of-type': {
                          borderTopRightRadius: '20px',
                        },
                        '&:last-of-type td:first-of-type': {
                          borderBottomLeftRadius: '20px',
                        },
                        '&:last-of-type td:last-of-type': {
                          borderBottomRightRadius: '20px',
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          borderTopLeftRadius: index === 0 ? '20px' : 0,
                          borderBottomLeftRadius: index === visibleRows.length - 1 ? '20px' : 0,
                        }}
                      >
                        {row.timestamp}
                      </TableCell>
                      <TableCell>{row.user}</TableCell>
                      <TableCell>{row.action}</TableCell>
                      <TableCell>{row.property}</TableCell>
                      <TableCell>{row.oldValue}</TableCell>
                      <TableCell
                        sx={{
                          borderTopRightRadius: index === 0 ? '20px' : 0,
                          borderBottomRightRadius: index === visibleRows.length - 1 ? '20px' : 0,
                        }}
                      >
                        {row.newValue}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={headCells.length} align="center">
                      {searchTerm
                        ? "No matching records found"
                        : "No data available"}
                    </TableCell>
                  </TableRow>
                )}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={headCells.length} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              '& .MuiTablePagination-select': {
                borderRadius: '20px',
              },
              '& .MuiTablePagination-actions button': {
                borderRadius: '20px',
              },
            }}
          />
        </Paper>
      </Box>
    </div>
  );
}

export default AuditTrailTable;
