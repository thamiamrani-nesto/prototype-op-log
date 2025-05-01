import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Eye, X } from "lucide-react";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import HomeIcon from "@mui/icons-material/Home";
import SavingsIcon from "@mui/icons-material/Savings";
import PaidIcon from "@mui/icons-material/Paid";
import SettingsIcon from "@mui/icons-material/Settings";
import RealEstateAgentIcon from "@mui/icons-material/RealEstateAgent"
import logo from './assets/logo.jpg';
import './styles.css';
import AuditTrailTable from './AuditTrailTable.jsx'

const navItems = [
  { label: "Income", icon: <PaidIcon fontSize="small" /> },
  { label: "Owned Properties", icon: <HomeIcon fontSize="small" /> },
  {label: "Assets & Down-payment", icon: <SavingsIcon fontSize="small" />},
  { label: "Subject Property", icon: <HomeIcon fontSize="small" /> },
  { label: "Liabilities", icon: <ListAltIcon fontSize="small" /> },
  { label: "Mortgage Details", icon: <AccountBalanceIcon fontSize="small" /> },
  { label: "HELOC Details", icon: <RealEstateAgentIcon fontSize="small" /> },
  { label: "App Account Settings", icon: <SettingsIcon fontSize="small" selected/> },
];

export function App() {
  const [showLog, setShowLog] = useState(false);

  return (
    <div className="flex h-screen w-full relative">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-black p-4 flex flex-col border-r">

        <nav className="flex-1 space-y-2 text-sm">
        <img src={logo} alt="Logo" style={{ width: "180px", height: "auto", margin:"25px" }} />

          {navItems.map(({ label, icon }) => (
            <div
              key={label}
              className="hover:bg-gray-100 p-2 rounded cursor-pointer flex items-center gap-2"
            >
              {icon}
              {label}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <div className="mb-4" sx={{margin: "1225px"}}>
          <span/>
        </div>
        <div className="mb-4 flex justify-end gap-2">
          <Button
            variant="contained"
            sx={{ borderRadius: "999px", boxShadow: 3, backgroundColor:"#232142", margin:"15px", font:"Montserrat" }}
          >
            Create Co-Applicant +
          </Button>

        </div>

        <Card className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200" sx={{ boxShadow: 5, margin: "45px" }}>
          <CardContent className="space-y-6">

            <div className="flex justify-end items-end">
  
              <div className="mb-4 flex justify-end gap-4">
                <Button variant="outlined" sx={{ borderRadius: "999px", color:"#001f3f" }}>
                  Notes (0)
                </Button>
                <Button sx={{ borderRadius: "100px", padding: "-5px", backgroundColor:"#232142", color:"white"}}>
                  Edit
                </Button>
                <Tooltip title="Operation log">
            <IconButton
              onClick={() => setShowLog(!showLog)}
              sx={{
                borderRadius: "999px",
                backgroundColor: "white",
                color: "black",
                boxShadow: "0 0 25px 6px rgba(255, 127, 80, 1)",
                animation: "pulse-intense 1.5s infinite ease-in-out",
              }}
            >
              <Eye className="w-4 h-4" />
            </IconButton>
          </Tooltip>
              </div>
            </div>
            <div>
                <h2 className="text-lg">Eric Weeks</h2>
           </div>
          <br/>
            {/* Applicant Info */}
            <section className="grid grid-cols-3 gap-4 text-sm filled-form">
              <div>
                <strong>Date Of Birth</strong>
                <div>10/08/1991</div>
              </div>
              <div>
                <strong>Salutation</strong>
                <div>Mr.</div>
              </div>
              <div>
                <strong>First Name</strong>
                <div>Eric</div>
              </div>
              <div>
                <strong>Last Name</strong>
                <div>Weeks</div>
              </div>
              <div>
                <strong>Phone</strong>
                <div>234-555-6789</div>
              </div>
              <div>
                <strong>Email</strong>
                <div>playwright_servicing_e2e_04@example.com</div>
              </div>
              <div>
                <strong>Marital Status</strong>
                <div>Single</div>
              </div>
              <div>
                <strong>Credit score</strong>
                <div>Excellent (721+)</div>
              </div>
              <div>
                <strong>Primary bank</strong>
                <div>Desjardins</div>
              </div>
              <div>
                <strong>Consumer Proposal / Bankruptcy</strong>
                <div>No</div>
              </div>
              <div>
                <strong>Income impacted by COVID-19</strong>
                <div>No</div>
              </div>
              <div>
                <strong>First time buyer</strong>
                <div>No</div>
              </div>
              <div>
                <strong>Permissions</strong>
                <div>Primary Applicant</div>
              </div>
              <div>
                <strong>Enable Privacy Mode</strong>
                <div>No</div>
              </div>
            </section>
            <br></br>
            {/* Bank Info */}
            <section className="filled-form">
              <h3 className="font-semibold text-sm mb-2">
                Bank information - underwriting
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Transit number</strong>
                  <div>12345</div>
                </div>
                <div>
                  <strong>Bank ID number</strong>
                  <div>123</div>
                </div>
                <div>
                  <strong>Account number</strong>
                  <div>123456789012</div>
                </div>
              </div>
            </section>
<br></br>
            {/* Address Info */}
            <section className="filled-form">
              <h3 className="font-semibold text-sm mb-2">
                Addresses information
              </h3>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div>Yes</div>
                </div>
                <div>
                  <strong>Occupied Years</strong>
                  <div>4</div>
                </div>
                <div>
                  <strong>Occupied Months</strong>
                  <div>5</div>
                </div>
                <div>
                  <strong>Situation</strong>
                  <div>Owner</div>
                </div>
              </div>
              <div className="mt-2 text-sm font-medium">
              <strong>Current address</strong>
              <div>
                3 unit-5045 Liberty Street, Saint-Lazare, H1E 0B2, QC, CA
                </div>
              </div>
            </section>
          </CardContent>
        </Card>

        {showLog && (
          <div className="fixed inset-0 bg-black/40">
            <Card className="rounded-xl shadow-xl border border-gray-300" sx={{margin: "70px", borderRadius: "35px"}}>
              <CardContent className="p-4 relative">
                <div className="flex justify-end">
                  <IconButton
                      className="absolute top-2 right-2"
                      size="small"
                      onClick={() => setShowLog(false)}
                      sx={{
                        backgroundColor: "#f0f0f0",
                        color: "#333",
                        "&:hover": { backgroundColor: "#ddd" },
                      }}
                    >
                    <X className="w-4 h-4" />
                  </IconButton>
                </div>
                <AuditTrailTable />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
