import { useState } from "react";
import emailjs from "@emailjs/browser";
import Head from "next/head";

export default function Home() {
  // Main state variables
  const [step, setStep] = useState("start");
  const [cluster, setCluster] = useState("");
  const [currentKPI, setCurrentKPI] = useState(1);
  const [formData, setFormData] = useState({});
  const [results, setResults] = useState({});
  
  // Define the KPI structure for each cluster
  const clusters = {
    "cashflow": {
      name: "Cashflow & Kapitaaloptimalisatie",
      kpis: [
        {
          id: 1,
          title: "Voorraadrotatie",
          questions: [
            { name: "cogs", label: "Wat was de totale kostprijs van verkochte goederen (COGS) in de afgelopen 12 maanden?", type: "number", placeholder: "€" },
            { name: "avgInventory", label: "Wat was de gemiddelde waarde van je voorraad in dezelfde periode?", type: "number", placeholder: "€" }
          ],
          benchmark: "Richtwaarde tussen 5 en 7 rotaties per jaar.",
          interpretation: "Een hogere voorraadrotatie wijst meestal op een efficiënter voorraadbeheer. Een lagere rotatie kan betekenen dat er meer kapitaal vastzit in voorraad, wat de cashflow kan vertragen. De ideale rotatie varieert per sector."
        },
        {
          id: 2,
          title: "Out-of-Stock Percentage",
          questions: [
            { name: "outOfStock", label: "Hoeveel keer was een besteld product niet op voorraad het afgelopen jaar?", type: "number", placeholder: "aantal" },
            { name: "totalRequests", label: "Hoeveel productaanvragen kreeg je in totaal in datzelfde jaar?", type: "number", placeholder: "aantal" }
          ],
          benchmark: "Minder dan 2%",
          interpretation: "Een lager percentage wijst erop dat producten vrijwel altijd beschikbaar zijn bij bestelling. Een hoger out-of-stock percentage kan duiden op gemiste verkoopkansen en klantontevredenheid."
        },
        {
          id: 3,
          title: "Days Sales Outstanding (DSO)",
          questions: [
            { name: "openInvoices", label: "Wat is het totaalbedrag van openstaande facturen momenteel?", type: "number", placeholder: "€" },
            { name: "annualRevenue", label: "Wat was je omzet over de afgelopen 12 maanden?", type: "number", placeholder: "€" }
          ],
          benchmark: "Tussen 45 en 60 dagen",
          interpretation: "Een lagere DSO betekent dat klanten gemiddeld sneller betalen. Een hogere DSO kan cashflow onder druk zetten en vraagt om goede opvolging van openstaande facturen."
        },
        {
          id: 4,
          title: "Voorraadwaarde",
          questions: [
            { name: "inventoryValue", label: "Wat is de huidige totale waarde van je voorraad?", type: "number", placeholder: "€" },
            { name: "inventoryRevenue", label: "Wat was je omzet over de afgelopen 12 maanden?", type: "number", placeholder: "€" }
          ],
          benchmark: "Richtlijn: voorraad onder 15-20% van jaaromzet.",
          interpretation: "Een relatief hoge voorraadwaarde kan wijzen op veel kapitaal dat vastzit. Dit hoeft niet negatief te zijn, zolang de voorraad nodig is om klantentevredenheid te waarborgen."
        }
      ]
    },
    "margin": {
      name: "Winstgevendheid & Margeoptimalisatie",
      kpis: [
        {
          id: 1,
          title: "Brutomarge %",
          questions: [
            { name: "revenue", label: "Wat was je omzet afgelopen jaar?", type: "number", placeholder: "€" },
            { name: "costOfSales", label: "Wat waren je totale inkoopkosten afgelopen jaar?", type: "number", placeholder: "€" }
          ],
          benchmark: "Sectorafhankelijk, typisch >30% in wholesale.",
          interpretation: "Een hogere brutomarge wijst op sterkere prijskracht of efficiëntere inkoop. Een lagere marge kan competitief zijn, maar vergt volume om rendabel te blijven."
        },
        {
          id: 2,
          title: "Gemiddelde Orderwaarde",
          questions: [
            { name: "totalRevenue", label: "Wat was je totale omzet afgelopen jaar?", type: "number", placeholder: "€" },
            { name: "totalOrders", label: "Hoeveel bestellingen had je in totaal?", type: "number", placeholder: "aantal" }
          ],
          benchmark: "Geen absolute norm.",
          interpretation: "Een hogere gemiddelde orderwaarde betekent dat klanten meer besteden per transactie. Dit kan bijdragen aan betere winstgevendheid."
        },
        {
          id: 3,
          title: "Retourpercentage",
          questions: [
            { name: "returnedOrders", label: "Hoeveel bestellingen zijn er retour gekomen het afgelopen jaar?", type: "number", placeholder: "aantal" },
            { name: "totalOrdersReturn", label: "Hoeveel bestellingen waren er in totaal?", type: "number", placeholder: "aantal" }
          ],
          benchmark: "Lager dan 3–5%",
          interpretation: "Een lager retourpercentage wijst vaak op goede productkwaliteit en duidelijke klantverwachtingen. Hogere retouren kunnen extra kosten veroorzaken."
        },
        {
          id: 4,
          title: "Productwinstgevendheid",
          questions: [
            { name: "productMargin", label: "Wat is de gemiddelde brutomarge (%) van je best verkopende productgroep?", type: "number", placeholder: "%" }
          ],
          benchmark: "Geen absolute norm.",
          interpretation: "Een goede productmarge biedt meer flexibiliteit in pricing en marketingacties."
        }
      ]
    },
    "service": {
      name: "Servicekwaliteit & Groeiversnelling",
      kpis: [
        {
          id: 1,
          title: "Perfect Order Rate %",
          questions: [
            { name: "perfectOrders", label: "Hoeveel bestellingen werden foutloos geleverd het afgelopen jaar?", type: "number", placeholder: "aantal" },
            { name: "totalOrdersPerf", label: "Hoeveel bestellingen in totaal?", type: "number", placeholder: "aantal" }
          ],
          benchmark: ">95%",
          interpretation: "Een hoge perfect order rate wijst op een betrouwbare operatie en hoge klanttevredenheid."
        },
        {
          id: 2,
          title: "Order Pick Accuracy %",
          questions: [
            { name: "correctPicks", label: "Hoeveel orders werden correct gepickt?", type: "number", placeholder: "aantal" },
            { name: "totalPicks", label: "Hoeveel orders gepickt in totaal?", type: "number", placeholder: "aantal" }
          ],
          benchmark: ">98%",
          interpretation: "Hoge pick-accuracy voorkomt fouten, retouren en verhoogt de klantentevredenheid."
        },
        {
          id: 3,
          title: "Gemiddelde Levertijd",
          questions: [
            { name: "totalDeliveryDays", label: "Totaal aantal dagen tussen bestelling en levering?", type: "number", placeholder: "dagen" },
            { name: "totalDeliveries", label: "Totaal aantal bestellingen?", type: "number", placeholder: "aantal" }
          ],
          benchmark: "Geen harde norm, sectorafhankelijk.",
          interpretation: "Snellere levering verhoogt klantentevredenheid, maar moet in balans blijven met nauwkeurigheid."
        },
        {
          id: 4,
          title: "Klanttevredenheidsscore (CSAT)",
          questions: [
            { name: "highScores", label: "Aantal klanten dat een score van 4 of 5 gaf?", type: "number", placeholder: "aantal" },
            { name: "totalFeedback", label: "Aantal klanten dat feedback gaf?", type: "number", placeholder: "aantal" }
          ],
          benchmark: "80–85%+ tevreden klanten.",
          interpretation: "Hoge tevredenheidscijfers correleren sterk met herhaalaankopen en klantloyaliteit."
        }
      ]
    }
  };

  // Data maturity follow-up questions (same for all KPIs)
  const dataMaturityQuestions = [
    {
      name: "dataAvailability",
      label: "Was deze informatie direct beschikbaar?",
      type: "select",
      options: [
        { value: "", label: "Selecteer..." },
        { value: "Direct beschikbaar", label: "Direct beschikbaar" },
        { value: "Moest even zoeken", label: "Moest even zoeken" },
        { value: "Moeilijk te vinden", label: "Moeilijk te vinden" }
      ]
    },
    {
      name: "manualWork",
      label: "Heb je hiervoor manueel werk moeten verrichten?",
      type: "select",
      options: [
        { value: "", label: "Selecteer..." },
        { value: "Nee, stond klaar", label: "Nee, stond klaar" },
        { value: "Ja, manueel opgezocht of gerekend", label: "Ja, manueel opgezocht of gerekend" },
        { value: "Ja, gecombineerd uit meerdere bronnen", label: "Ja, gecombineerd uit meerdere bronnen" }
      ]
    }
  ];

  // Handler to select a cluster and start the flow
  const handleClusterSelect = (selectedCluster) => {
    setCluster(selectedCluster);
    setCurrentKPI(1);
    setStep("kpi");
  };

  // Handle input change for form fields
  const handleInputChange = (e) => {
    // Parse number inputs
    const value = e.target.type === 'number' ? 
      (e.target.value === '' ? '' : parseFloat(e.target.value)) : 
      e.target.value;
    
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Navigate to the next KPI question
  const handleNextKPI = () => {
    if (currentKPI < clusters[cluster].kpis.length) {
      setCurrentKPI(currentKPI + 1);
    } else {
      calculateResults();
      setStep("results");
    }
  };

  // Navigate to the previous KPI question
  const handlePrevKPI = () => {
    if (currentKPI > 1) {
      setCurrentKPI(currentKPI - 1);
    } else {
      setStep("cluster");
    }
  };

  // Calculate results based on the current cluster
  const calculateResults = () => {
    let calculatedResults = {};
    
    if (cluster === "cashflow") {
      // Extract KPI-specific values
      const kpi1_cogs = parseFloat(formData["cogs_kpi1"]) || 0;
      const kpi1_avgInventory = parseFloat(formData["avgInventory_kpi1"]) || 1; // Avoid division by zero
      
      const kpi2_outOfStock = parseFloat(formData["outOfStock_kpi2"]) || 0;
      const kpi2_totalRequests = parseFloat(formData["totalRequests_kpi2"]) || 1;
      
      const kpi3_openInvoices = parseFloat(formData["openInvoices_kpi3"]) || 0;
      const kpi3_annualRevenue = parseFloat(formData["annualRevenue_kpi3"]) || 1;
      
      const kpi4_inventoryValue = parseFloat(formData["inventoryValue_kpi4"]) || 0;
      const kpi4_inventoryRevenue = parseFloat(formData["inventoryRevenue_kpi4"]) || 1;
      
      // Voorraadrotatie
      const inventoryTurnover = kpi1_cogs / kpi1_avgInventory;
      
      // Out-of-Stock Percentage
      const outOfStockPercentage = (kpi2_outOfStock / kpi2_totalRequests) * 100;
      
      // Days Sales Outstanding (DSO)
      const dso = (kpi3_openInvoices / kpi3_annualRevenue) * 365;
      
      // Voorraadwaarde vs Annual Revenue
      const inventoryPercentage = (kpi4_inventoryValue / kpi4_inventoryRevenue) * 100;
      
      calculatedResults = {
        "Voorraadrotatie": isNaN(inventoryTurnover) ? "0.00 keer per jaar" : inventoryTurnover.toFixed(2) + " keer per jaar",
        "Out-of-Stock Percentage": isNaN(outOfStockPercentage) ? "0.00%" : outOfStockPercentage.toFixed(2) + "%",
        "Days Sales Outstanding (DSO)": isNaN(dso) ? "0.0 dagen" : dso.toFixed(1) + " dagen",
        "Voorraadwaarde": isNaN(inventoryPercentage) ? "0.00% van jaaromzet" : inventoryPercentage.toFixed(2) + "% van jaaromzet"
      };
    } 
    else if (cluster === "margin") {
      // Extract KPI-specific values
      const kpi1_revenue = parseFloat(formData["revenue_kpi1"]) || 0;
      const kpi1_costOfSales = parseFloat(formData["costOfSales_kpi1"]) || 0;
      
      const kpi2_totalRevenue = parseFloat(formData["totalRevenue_kpi2"]) || 0;
      const kpi2_totalOrders = parseFloat(formData["totalOrders_kpi2"]) || 1;
      
      const kpi3_returnedOrders = parseFloat(formData["returnedOrders_kpi3"]) || 0;
      const kpi3_totalOrdersReturn = parseFloat(formData["totalOrdersReturn_kpi3"]) || 1;
      
      const kpi4_productMargin = parseFloat(formData["productMargin_kpi4"]) || 0;
      
      // Brutomarge
      const grossMargin = kpi1_revenue > 0 ? 
        ((kpi1_revenue - kpi1_costOfSales) / kpi1_revenue) * 100 : 0;
      
      // Gemiddelde Orderwaarde
      const averageOrderValue = kpi2_totalOrders > 0 ?
        kpi2_totalRevenue / kpi2_totalOrders : 0;
      
      // Retourpercentage
      const returnRate = (kpi3_returnedOrders / kpi3_totalOrdersReturn) * 100;
      
      calculatedResults = {
        "Brutomarge": isNaN(grossMargin) ? "0.00%" : grossMargin.toFixed(2) + "%",
        "Gemiddelde Orderwaarde": isNaN(averageOrderValue) ? "€0.00" : "€" + averageOrderValue.toFixed(2),
        "Retourpercentage": isNaN(returnRate) ? "0.00%" : returnRate.toFixed(2) + "%",
        "Productwinstgevendheid": isNaN(kpi4_productMargin) ? "0%" : kpi4_productMargin + "%"
      };
    } 
    else if (cluster === "service") {
      // Extract KPI-specific values
      const kpi1_perfectOrders = parseFloat(formData["perfectOrders_kpi1"]) || 0;
      const kpi1_totalOrdersPerf = parseFloat(formData["totalOrdersPerf_kpi1"]) || 1;
      
      const kpi2_correctPicks = parseFloat(formData["correctPicks_kpi2"]) || 0;
      const kpi2_totalPicks = parseFloat(formData["totalPicks_kpi2"]) || 1;
      
      const kpi3_totalDeliveryDays = parseFloat(formData["totalDeliveryDays_kpi3"]) || 0;
      const kpi3_totalDeliveries = parseFloat(formData["totalDeliveries_kpi3"]) || 1;
      
      const kpi4_highScores = parseFloat(formData["highScores_kpi4"]) || 0;
      const kpi4_totalFeedback = parseFloat(formData["totalFeedback_kpi4"]) || 1;
      
      // Perfect Order Rate
      const perfectOrderRate = (kpi1_perfectOrders / kpi1_totalOrdersPerf) * 100;
      
      // Order Pick Accuracy
      const pickAccuracy = (kpi2_correctPicks / kpi2_totalPicks) * 100;
      
      // Gemiddelde Levertijd
      const averageDeliveryTime = kpi3_totalDeliveryDays / kpi3_totalDeliveries;
      
      // CSAT
      const csatScore = (kpi4_highScores / kpi4_totalFeedback) * 100;
      
      calculatedResults = {
        "Perfect Order Rate": isNaN(perfectOrderRate) ? "0.00%" : perfectOrderRate.toFixed(2) + "%",
        "Order Pick Accuracy": isNaN(pickAccuracy) ? "0.00%" : pickAccuracy.toFixed(2) + "%",
        "Gemiddelde Levertijd": isNaN(averageDeliveryTime) ? "0.0 dagen" : averageDeliveryTime.toFixed(1) + " dagen",
        "Klanttevredenheidsscore": isNaN(csatScore) ? "0.00%" : csatScore.toFixed(2) + "%"
      };
    }
    
    // Calculate data maturity metrics
    const dataMaturityScores = {
      "Direct beschikbaar": calculateDataMaturityPercentage("dataAvailability", "Direct beschikbaar"),
      "Zonder manuele inspanning": calculateDataMaturityPercentage("manualWork", "Nee, stond klaar")
    };
    
    setResults({
      kpiResults: calculatedResults,
      dataMaturity: dataMaturityScores
    });
  };
  
  // Calculate percentage of data maturity metrics
  const calculateDataMaturityPercentage = (field, value) => {
    let count = 0;
    const totalKPIs = clusters[cluster].kpis.length;
    
    for (let i = 1; i <= totalKPIs; i++) {
      if (formData[`${field}_kpi${i}`] === value) {
        count++;
      }
    }
    
    return Math.round((count / totalKPIs) * 100);
  };

  // Send email with results
  const sendEmail = () => {
    const templateParams = {
      cluster: clusters[cluster].name,
      company: formData.company || "",
      user_name: formData.name || "",
      user_email: formData.email || "",
      user_phone: formData.phone || "",
      results: JSON.stringify(results, null, 2),
    };
    
    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_sdzz11f",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_guwz73d",
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_USER_ID || "-FsQ2G8CmhnyhIQZW"
      )
      .then(() => {
        setStep("thankyou");
      })
      .catch((error) => console.error("Email error:", error));
  };

  // Reset the flow to start again
  const resetFlow = () => {
    setStep("start");
    setCluster("");
    setCurrentKPI(1);
    setFormData({});
    setResults({});
  };

  // Styles definition
  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: "'Poppins', sans-serif",
      color: "#0F3A4D",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column"
    },
    header: {
      marginBottom: "40px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    logo: {
      width: "240px",
      height: "auto",
      margin: "0 auto 20px",
      display: "block"
    },
    title: {
      fontSize: "32px",
      fontWeight: "700",
      marginBottom: "20px",
      color: "#0F3A4D",
      textAlign: "center"
    },
    subtitle: {
      fontSize: "20px",
      marginBottom: "30px",
      lineHeight: "1.6",
      fontWeight: "400",
      textAlign: "center"
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "35px",
      boxShadow: "0 8px 30px rgba(15, 58, 77, 0.1)",
      maxWidth: "650px",
      margin: "0 auto 40px",
      width: "100%"
    },
    button: {
      backgroundColor: "#E7440D",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "16px 30px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.3s",
      margin: "10px 5px",
      width: "auto",
      minWidth: "200px"
    },
    buttonHover: {
      backgroundColor: "#C53C0D"
    },
    secondaryButton: {
      backgroundColor: "#FFFFFF",
      color: "#0F3A4D",
      border: "2px solid #0F3A4D",
      borderRadius: "8px",
      padding: "14px 28px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
      margin: "10px 5px",
      width: "auto",
      minWidth: "120px"
    },
    secondaryButtonHover: {
      backgroundColor: "#F5F7F9"
    },
    clusterButton: {
      backgroundColor: "#FFFFFF",
      color: "#0F3A4D",
      border: "2px solid #0F3A4D",
      borderRadius: "8px",
      padding: "22px 28px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s",
      margin: "12px 0",
      width: "100%",
      textAlign: "left",
      position: "relative"
    },
    clusterButtonHover: {
      backgroundColor: "#F5F7F9"
    },
    clusterArrow: {
      position: "absolute",
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)"
    },
    formGroup: {
      marginBottom: "24px"
    },
    label: {
      display: "block",
      marginBottom: "10px",
      fontWeight: "500",
      fontSize: "16px"
    },
    input: {
      width: "100%",
      padding: "14px 16px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      marginBottom: "5px",
      boxSizing: "border-box"
    },
    select: {
      width: "100%",
      padding: "14px 16px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      boxSizing: "border-box"
    },
    results: {
      backgroundColor: "#F5F7F9",
      padding: "25px",
      borderRadius: "10px",
      marginBottom: "35px"
    },
    resultItem: {
      margin: "12px 0",
      fontSize: "18px",
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid #e5e7eb"
    },
    resultSection: {
      marginBottom: "30px"
    },
    footer: {
      marginTop: "auto",
      textAlign: "center",
      fontSize: "14px",
      color: "#6B7280",
      padding: "20px 0"
    },
    resultHeading: {
      color: "#E7440D",
      fontSize: "22px",
      fontWeight: "600",
      marginBottom: "18px"
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      marginTop: "35px",
      gap: "10px"
    },
    progressContainer: {
      marginBottom: "30px"
    },
    progressBar: {
      width: "100%",
      height: "8px",
      backgroundColor: "#E5E7EB",
      borderRadius: "4px",
      marginBottom: "10px"
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#E7440D",
      borderRadius: "4px",
      transition: "width 0.3s ease"
    },
    progressText: {
      textAlign: "right",
      fontSize: "14px",
      color: "#6B7280"
    },
    kpiNavigationContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "35px"
    },
    benchmarkContainer: {
      backgroundColor: "#F0F7FF",
      padding: "15px",
      borderRadius: "8px",
      marginTop: "15px",
      marginBottom: "25px"
    },
    benchmarkHeading: {
      fontSize: "16px",
      fontWeight: "600",
      marginBottom: "8px",
      color: "#0F3A4D"
    },
    interpretationContainer: {
      backgroundColor: "#F9F9F9",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "25px"
    },
    interpretationText: {
      fontSize: "15px",
      fontStyle: "italic",
      color: "#4B5563",
      lineHeight: "1.6"
    }
  };

  // Calculate current progress percentage for progress bar
  const calculateProgress = () => {
    if (step === "start" || step === "cluster") {
      return 0;
    }
    
    if (step === "results" || step === "thankyou") {
      return 100;
    }
    
    // If we're in KPI questions
    const totalKPIs = clusters[cluster]?.kpis.length || 4;
    return Math.round((currentKPI / totalKPIs) * 100);
  };

  // Render the Progress Bar component
  const ProgressBar = () => {
    const progress = calculateProgress();
    return (
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${progress}%`
            }}
          ></div>
        </div>
        <div style={styles.progressText}>{progress}% voltooid</div>
      </div>
    );
  };

  // Main rendering
  return (
    <>
      <Head>
        <title>PODAS KPI-Analysetool</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <div style={styles.container}>
        <div style={styles.header}>
          <img 
            src="/logo.png" 
            alt="Podas Logo" 
            style={styles.logo} 
          />
        </div>

        {/* Progress bar - show on all steps except the start and thank you */}
        {step !== "start" && step !== "thankyou" && <ProgressBar />}

        {/* Start screen */}
        {step === "start" && (
          <div style={styles.card}>
            <h1 style={styles.title}>Kies wat je wilt analyseren</h1>
            <p style={styles.subtitle}>
              Selecteer hieronder het domein waarin je vandaag jouw bedrijfsvoering wilt laten analyseren.
              We brengen enkele kern-KPI's in kaart en tonen hoe jouw situatie zich verhoudt tot gebruikelijke benchmarks.
            </p>
            <p style={{...styles.subtitle, fontSize: "16px", fontStyle: "italic"}}>
              Deze analyse is objectief. Er worden geen adviezen gegeven.
              Belangrijk: prestaties moeten altijd bekeken worden in balans met elkaar, niet afzonderlijk.
            </p>
            <div style={{textAlign: "center", marginTop: "30px"}}>
              <button 
                style={styles.button}
                onMouseOver={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                onMouseOut={e => e.target.style.backgroundColor = styles.button.backgroundColor}
                onClick={() => setStep("cluster")}
              >
                Start de KPI-analyse
              </button>
            </div>
          </div>
        )}

        {/* Cluster selection */}
        {step === "cluster" && (
          <div style={styles.card}>
            <h2 style={{...styles.title, fontSize: "26px"}}>Kies wat je wilt analyseren</h2>
            
            <div style={{marginTop: "25px"}}>
              <button 
                style={styles.clusterButton}
                onMouseOver={e => e.target.style.backgroundColor = styles.clusterButtonHover.backgroundColor}
                onMouseOut={e => e.target.style.backgroundColor = styles.clusterButton.backgroundColor}
                onClick={() => handleClusterSelect("cashflow")}
              >
                Cashflow & Kapitaaloptimalisatie
                <span style={styles.clusterArrow}>→</span>
              </button>
              
              <button 
                style={styles.clusterButton}
                onMouseOver={e => e.target.style.backgroundColor = styles.clusterButtonHover.backgroundColor}
                onMouseOut={e => e.target.style.backgroundColor = styles.clusterButton.backgroundColor}
                onClick={() => handleClusterSelect("margin")}
              >
                Winstgevendheid & Margeoptimalisatie
                <span style={styles.clusterArrow}>→</span>
              </button>
              
              <button 
                style={styles.clusterButton}
                onMouseOver={e => e.target.style.backgroundColor = styles.clusterButtonHover.backgroundColor}
                onMouseOut={e => e.target.style.backgroundColor = styles.clusterButton.backgroundColor}
                onClick={() => handleClusterSelect("service")}
              >
                Servicekwaliteit & Groeiversnelling
                <span style={styles.clusterArrow}>→</span>
              </button>
            </div>
          </div>
        )}

        {/* KPI Questions */}
        {step === "kpi" && cluster && (
          <div style={styles.card}>
            <h2 style={{...styles.title, fontSize: "24px", marginBottom: "10px"}}>
              {clusters[cluster].name}
            </h2>
            <h3 style={{fontSize: "22px", fontWeight: "600", marginBottom: "25px", color: "#E7440D"}}>
              {currentKPI}. {clusters[cluster].kpis[currentKPI-1].title}
            </h3>
            
            {/* KPI specific questions */}
            {clusters[cluster].kpis[currentKPI-1].questions.map((question, idx) => (
              <div style={styles.formGroup} key={idx}>
                <label style={styles.label}>{question.label}</label>
                <input 
                  name={`${question.name}_kpi${currentKPI}`}
                  type={question.type} 
                  placeholder={question.placeholder}
                  style={styles.input}
                  onChange={handleInputChange} 
                  value={formData[`${question.name}_kpi${currentKPI}`] || ""}
                />
              </div>
            ))}
            
            {/* Data maturity questions */}
            <h4 style={{fontSize: "18px", fontWeight: "500", marginTop: "30px", marginBottom: "15px"}}>
              Data beschikbaarheid
            </h4>
            
            {dataMaturityQuestions.map((question, idx) => (
              <div style={styles.formGroup} key={idx}>
                <label style={styles.label}>{question.label}</label>
                <select 
                  name={`${question.name}_kpi${currentKPI}`}
                  style={styles.select}
                  onChange={handleInputChange}
                  value={formData[`${question.name}_kpi${currentKPI}`] || ""}
                >
                  {question.options.map((option, optIdx) => (
                    <option key={optIdx} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            ))}
            
            {/* Navigation buttons */}
            <div style={styles.kpiNavigationContainer}>
              <button 
                onClick={handlePrevKPI}
                style={styles.secondaryButton}
                onMouseOver={e => e.target.style.backgroundColor = styles.secondaryButtonHover.backgroundColor}
                onMouseOut={e => e.target.style.backgroundColor = styles.secondaryButton.backgroundColor}
              >
                Terug
              </button>
              
              <button 
                onClick={handleNextKPI} 
                style={styles.button}
                onMouseOver={e => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                onMouseOut={e => e.target.style.backgroundColor = styles.button.backgroundColor}
              >
                {currentKPI < clusters[cluster].kpis.length ? "Volgende" : "Resultaten bekijken"}
              </button>
            </div>
          </div>
        )}
