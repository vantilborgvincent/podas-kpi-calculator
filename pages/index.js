import { useState } from "react";
import emailjs from "emailjs-com";
import Head from "next/head";

export default function Home() {
  const [step, setStep] = useState("start");
  const [sector, setSector] = useState("");
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState({});
  const sectors = ["Groothandel & Distributie", "Andere / Algemeen"];

  const handleSectorSelect = (selectedSector) => {
    setSector(selectedSector);
    setStep("kpi");
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateKPI = () => {
    let calc = {};
    if (sector === "Groothandel & Distributie") {
      const marge = ((formData.omzet - formData.kostprijs) / formData.omzet) * 100;
      const leverbetrouwbaarheid = (formData.opTijd / formData.totaalLeveringen) * 100;
      const stockrotatie = formData.verkocht / formData.voorrraad;
      calc = { 
        marge: marge.toFixed(2) + " %", 
        leverbetrouwbaarheid: leverbetrouwbaarheid.toFixed(2) + " %", 
        stockrotatie: stockrotatie.toFixed(2) 
      };
    } else if (sector === "Andere / Algemeen") {
      const facturatiegraad = (formData.factBinnen30 / formData.factTotaal) * 100;
      calc = { 
        facturatiegraad: facturatiegraad.toFixed(2) + " %", 
        manueleRegistraties: formData.manueleRegistraties, 
        dataBeschikbaarheid: formData.dataBeschikbaarheid + " %" 
      };
    }
    setResults(calc);
    setStep("results");
  };

  const sendEmail = () => {
    const templateParams = {
      sector: sector,
      company: formData.company || "",
      user_name: formData.name || "",
      user_email: formData.email || "",
      user_phone: formData.phone || "",
      results: JSON.stringify(results, null, 2),
      kpi1_access: formData.kpi1_access || "",
      kpi2_access: formData.kpi2_access || "",
      kpi3_access: formData.kpi3_access || "",
    };
    emailjs
      .send("service_sdzz11f", "template_guwz73d", templateParams, "-FsQ2G8CmhnyhIQZW")
      .then(() => {
        setStep("thankyou");
      })
      .catch((error) => console.error("Email error:", error));
  };

  // Styles based on Podds logo colors
  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "30px 20px",
      fontFamily: "'Poppins', sans-serif",
      color: "#0F3A4D",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    },
    header: {
      marginBottom: "40px",
      textAlign: "center"
    },
    logo: {
      width: "240px",
      height: "auto",
      margin: "0 auto 30px",
      display: "block"
    },
    title: {
      fontSize: "32px",
      fontWeight: "700",
      marginBottom: "16px",
      color: "#0F3A4D"
    },
    subtitle: {
      fontSize: "20px",
      marginBottom: "30px",
      lineHeight: "1.5",
      fontWeight: "400"
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "30px",
      boxShadow: "0 4px 20px rgba(15, 58, 77, 0.1)",
      maxWidth: "600px",
      margin: "0 auto",
      width: "100%"
    },
    button: {
      backgroundColor: "#E7440D",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "14px 28px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s",
      margin: "10px 5px"
    },
    buttonHover: {
      backgroundColor: "#C53C0D"
    },
    sectorButton: {
      backgroundColor: "#FFFFFF",
      color: "#0F3A4D",
      border: "2px solid #0F3A4D",
      borderRadius: "6px",
      padding: "12px 26px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
      margin: "10px 5px",
      width: "250px",
      display: "inline-block"
    },
    sectorButtonHover: {
      backgroundColor: "#0F3A4D",
      color: "white"
    },
    formGroup: {
      marginBottom: "22px"
    },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "500"
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "16px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      marginBottom: "5px"
    },
    select: {
      width: "100%",
      padding: "12px 16px",
      fontSize: "16px",
      borderRadius: "6px",
      border: "1px solid #ccc"
    },
    results: {
      backgroundColor: "#F5F7F9",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "30px"
    },
    resultItem: {
      margin: "10px 0",
      fontSize: "18px",
      display: "flex",
      justifyContent: "space-between"
    },
    footer: {
      marginTop: "40px",
      textAlign: "center",
      fontSize: "14px",
      color: "#6B7280"
    },
    resultHeading: {
      color: "#E7440D",
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "15px"
    }
  };

  // Improved Podds logo as an SVG
  const PoddsLogo = () => (
    <svg width="240" height="60" viewBox="0 0 240 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* P */}
      <rect x="10" y="10" width="15" height="40" fill="#0F3A4D" />
      {/* First O */}
      <path d="M35 30C35 19.5 43.5 10 55 10H65C76.5 10 85 19.5 85 30C85 40.5 76.5 50 65 50H55C43.5 50 35 40.5 35 30Z" fill="#0F3A4D" />
      <path d="M55 20H65C70.5 20 75 24.5 75 30C75 35.5 70.5 40 65 40H55C49.5 40 45 35.5 45 30C45 24.5 49.5 20 55 20Z" fill="white" />
      {/* Second O */}
      <path d="M95 30C95 19.5 103.5 10 115 10H125C136.5 10 145 19.5 145 30C145 40.5 136.5 50 125 50H115C103.5 50 95 40.5 95 30Z" fill="#0F3A4D" />
      <path d="M115 20H125C130.5 20 135 24.5 135 30C135 35.5 130.5 40 125 40H115C109.5 40 105 35.5 105 30C105 24.5 109.5 20 115 20Z" fill="white" />
      {/* D */}
      <path d="M155 10H165C180 10 190 20 190 30C190 40 180 50 165 50H155V10Z" fill="#0F3A4D" />
      {/* S */}
      <path d="M200 10C200 10 220 10 220 25V50H200V10Z" fill="#E7440D" />
    </svg>
  );

  // Improved tagline SVG
  const TaglineSVG = () => (
    <div style={{ fontSize: "14px", color: "#0F3A4D", marginTop: "5px" }}>
      Making <span style={{ color: "#E7440D" }}>digital Automation</span> and <span style={{ color: "#E7440D" }}>AI</span> accessible to every business
    </div>
  );

  // Main rendering
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div style={styles.container}>
        <div style={styles.header}>
          <PoddsLogo />
          <TaglineSVG />
        </div>

        {step === "start" && (
          <div style={styles.card}>
            <h1 style={styles.title}>Hoe goed kent u uw kerncijfers?</h1>
            <p style={styles.subtitle}>
              Bereken uw belangrijkste KPI's per sector en ontdek hoe makkelijk deze inzichten bij u beschikbaar zijn.
            </p>
            <div style={{textAlign: "center", marginTop: "30px"}}>
              <button 
                style={styles.button}
                onMouseOver={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                onMouseOut={e => e.target.style.backgroundColor = styles.button.backgroundColor}
                onClick={() => setStep("sector")}
              >
                Start de KPI-check
              </button>
            </div>
          </div>
        )}

        {step === "sector" && (
          <div style={styles.card}>
            <h2 style={{...styles.title, fontSize: "26px"}}>In welke sector is uw bedrijf actief?</h2>
            <div style={{textAlign: "center", marginTop: "30px"}}>
              {sectors.map((s) => (
                <button 
                  key={s} 
                  style={styles.sectorButton}
                  onMouseOver={e => {
                    e.target.style.backgroundColor = styles.sectorButtonHover.backgroundColor;
                    e.target.style.color = styles.sectorButtonHover.color;
                  }}
                  onMouseOut={e => {
                    e.target.style.backgroundColor = styles.sectorButton.backgroundColor;
                    e.target.style.color = styles.sectorButton.color;
                  }}
                  onClick={() => handleSectorSelect(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "kpi" && (
          <div style={styles.card}>
            <h2 style={{...styles.title, fontSize: "26px", marginBottom: "25px"}}>
              Sector: <span style={{color: "#E7440D"}}>{sector}</span>
            </h2>
            
            {sector === "Groothandel & Distributie" ? (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Omzet (€):</label>
                  <input 
                    name="omzet" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Kostprijs (€):</label>
                  <input 
                    name="kostprijs" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoe makkelijk had u deze data beschikbaar?</label>
                  <select 
                    name="kpi1_access" 
                    style={styles.select}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecteer...</option>
                    <option value="Direct uit systeem">🟢 Direct uit systeem</option>
                    <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
                    <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Aantal leveringen:</label>
                  <input 
                    name="totaalLeveringen" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Aantal op tijd geleverd:</label>
                  <input 
                    name="opTijd" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoe makkelijk had u deze data beschikbaar?</label>
                  <select 
                    name="kpi2_access" 
                    style={styles.select}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecteer...</option>
                    <option value="Direct uit systeem">🟢 Direct uit systeem</option>
                    <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
                    <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Verkochte aantallen:</label>
                  <input 
                    name="verkocht" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Gemiddelde voorraad:</label>
                  <input 
                    name="voorrraad" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoe makkelijk had u deze data beschikbaar?</label>
                  <select 
                    name="kpi3_access" 
                    style={styles.select}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecteer...</option>
                    <option value="Direct uit systeem">🟢 Direct uit systeem</option>
                    <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
                    <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
                  </select>
                </div>
              </>
            ) : (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Totaal facturatiebedrag (€):</label>
                  <input 
                    name="factTotaal" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Gefactureerd binnen 30 dagen (€):</label>
                  <input 
                    name="factBinnen30" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoe makkelijk had u deze data beschikbaar?</label>
                  <select 
                    name="kpi1_access" 
                    style={styles.select}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecteer...</option>
                    <option value="Direct uit systeem">🟢 Direct uit systeem</option>
                    <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
                    <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Manuele registraties per week:</label>
                  <input 
                    name="manueleRegistraties" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoe makkelijk had u deze data beschikbaar?</label>
                  <select 
                    name="kpi2_access" 
                    style={styles.select}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecteer...</option>
                    <option value="Direct uit systeem">🟢 Direct uit systeem</option>
                    <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
                    <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>% beschikbare data voor kernrapportage:</label>
                  <input 
                    name="dataBeschikbaarheid" 
                    type="number" 
                    style={styles.input}
                    onChange={handleInputChange} 
                    placeholder="%" 
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hoe makkelijk had u deze data beschikbaar?</label>
                  <select 
                    name="kpi3_access" 
                    style={styles.select}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecteer...</option>
                    <option value="Direct uit systeem">🟢 Direct uit systeem</option>
                    <option value="Alleen via manueel werk">🟠 Alleen via manueel werk</option>
                    <option value="Niet beschikbaar">🔴 Niet beschikbaar</option>
                  </select>
                </div>
              </>
            )}
            
            <div style={{textAlign: "center", marginTop: "30px"}}>
              <button 
                onClick={calculateKPI} 
                style={styles.button}
                onMouseOver={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                onMouseOut={e => e.target.style.backgroundColor = styles.button.backgroundColor}
              >
                Bekijk mijn resultaten
              </button>
            </div>
          </div>
        )}

        {step === "results" && (
          <div style={styles.card}>
            <h2 style={{...styles.title, fontSize: "26px", marginBottom: "25px"}}>Uw KPI Resultaten</h2>
            
            <div style={styles.results}>
              <h3 style={styles.resultHeading}>Berekende KPI's:</h3>
              {Object.entries(results).map(([key, value]) => (
                <div key={key} style={styles.resultItem}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                  <span>{value}</span>
                </div>
              ))}
            </div>
            
            <h3 style={{...styles.title, fontSize: "22px", marginTop: "30px", marginBottom: "20px"}}>
              Ontvang uw resultaten per e-mail
            </h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Bedrijfsnaam:</label>
              <input name="company" style={styles.input} onChange={handleInputChange} />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Naam contactpersoon:</label>
              <input name="name" style={styles.input} onChange={handleInputChange} />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>E-mailadres:</label>
              <input name="email" type="email" style={styles.input} onChange={handleInputChange} />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Telefoonnummer (optioneel):</label>
              <input name="phone" style={styles.input} onChange={handleInputChange} />
            </div>
            
            <div style={{textAlign: "center", marginTop: "30px"}}>
              <button 
                onClick={sendEmail} 
                style={styles.button}
                onMouseOver={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                onMouseOut={e => e.target.style.backgroundColor = styles.button.backgroundColor}
              >
                Verstuur mijn KPI-resultaten
              </button>
            </div>
          </div>
        )}

        {step === "thankyou" && (
          <div style={styles.card}>
            <div style={{textAlign: "center"}}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="40" fill="#E7440D" fillOpacity="0.1"/>
                <path d="M32 40L38 46L48 34" stroke="#E7440D" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              <h2 style={{...styles.title, fontSize: "26px", marginTop: "20px"}}>
                Bedankt voor het invullen!
              </h2>
              
              <p style={{fontSize: "18px", lineHeight: "1.6", marginTop: "20px"}}>
                U ontvangt uw resultaten binnenkort per e-mail. <br/>
                Wij nemen graag contact met u op om deze te bespreken.
              </p>
              
              <div style={{marginTop: "40px"}}>
                <a 
                  href="/"
                  style={{...styles.button, textDecoration: "none"}}
                  onMouseOver={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                  onMouseOut={e => e.target.style.backgroundColor = styles.button.backgroundColor}
                >
                  Terug naar begin
                </a>
              </div>
            </div>
          </div>
        )}
        
        <div style={styles.footer}>
          <p>© {new Date().getFullYear()} Podds - Making digital Automation and AI accessible to every business</p>
        </div>
      </div>
    </>
  );
}
