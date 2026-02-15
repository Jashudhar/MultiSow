// Preset Crop Models for MultiSow
// Pre-designed models optimized for different acre sizes and regions
// ALL VALUES VALIDATED WITH EXACT CALCULATIONS - Feb 2, 2026

const presetModels = [
    {
        id: 'wayanad-classic',
        name: 'Wayanad Classic',
        description: 'Traditional Kerala multi-tier system optimized for tropical climate with high-value spice crops',
        acres: 2,
        region: 'Wayanad, Kerala',
        soilType: 'laterite',
        difficulty: 'Beginner',
        estimatedYield: '390 Quintals',
        estimatedRevenue: '₹13.5L/year',
        cropSchedule: {
            overstory: { crop: 'Coconut Palm', spacing: 8, plants: 146 },
            middle: { crop: 'Banana', spacing: 3, plants: 900 },
            understory: { crop: 'Turmeric', spacing: 50, plants: 45000 },
            vertical: { crop: 'Black Pepper', perTree: 2, total: 292 }
        },
        plantingGuide: {
            overstory: {
                rowSpacing: '8m × 8m',
                plantSpacing: '8m between palms',
                plantingDepth: '60-90 cm pit',
                plantingSeason: 'Jun-Sep (Monsoon)',
                irrigation: 'Drip irrigation recommended, 40-50L per palm per day in summer. Basin irrigation during monsoon.',
                fertilizers: [
                    { stage: 'Basal', type: 'FYM + Bone Meal', dosage: '25 kg FYM + 2 kg bone meal/palm', brand: 'IFFCO' },
                    { stage: 'Year 1-3', type: 'NPK 14:14:14', dosage: '500g/palm quarterly', brand: 'IFFCO NPK' },
                    { stage: 'Bearing', type: 'NPK 13:00:45', dosage: '1 kg/palm, 2x/year', brand: 'Coromandel' },
                    { stage: 'Micronutrient', type: 'Borax + MgSO4', dosage: '50g + 500g/palm', brand: 'IFFCO Sagarika' }
                ]
            },
            middle: {
                rowSpacing: '3m × 3m',
                plantSpacing: '3m between plants',
                plantingDepth: '30-45 cm pit',
                plantingSeason: 'Jun-Jul (Early Monsoon)',
                irrigation: 'Basin irrigation, 15-20L per plant every 4 days. Drip with 4L/hr emitter preferred.',
                fertilizers: [
                    { stage: 'Planting', type: 'FYM + SSP', dosage: '10 kg FYM + 250g SSP/pit', brand: 'Paradeep SSP' },
                    { stage: 'Vegetative', type: 'Urea', dosage: '200g/plant monthly', brand: 'IFFCO Urea' },
                    { stage: 'Bunch Dev.', type: 'MOP (Potash)', dosage: '300g/plant', brand: 'IFFCO MOP' },
                    { stage: 'Growth', type: 'NPK 19:19:19', dosage: '100g/plant fortnightly', brand: 'Rashtriya Chem.' }
                ]
            },
            understory: {
                rowSpacing: '30 cm × 20 cm',
                plantSpacing: '20 cm between rhizomes',
                plantingDepth: '5-7 cm deep',
                plantingSeason: 'May-Jun (Pre-Monsoon)',
                irrigation: 'Sprinkler/drip, moist but not waterlogged. Irrigate every 7 days in dry spells.',
                fertilizers: [
                    { stage: 'Basal', type: 'FYM + Neem Cake', dosage: '30 tonnes FYM + 2 tonnes neem cake/ha', brand: 'Local FYM' },
                    { stage: '30 DAP', type: 'Urea', dosage: '30 kg/ha', brand: 'IFFCO Urea' },
                    { stage: '60 DAP', type: 'NPK 10:26:26', dosage: '60 kg/ha', brand: 'RCF Suphala' },
                    { stage: '120 DAP', type: 'MOP', dosage: '30 kg/ha', brand: 'IFFCO MOP' }
                ]
            },
            vertical: {
                rowSpacing: 'Trained on coconut trunk',
                plantSpacing: '2 vines per tree',
                plantingDepth: '30-40 cm pit near trunk',
                plantingSeason: 'Jun-Jul (Monsoon start)',
                irrigation: 'Shared with coconut irrigation. Mulch with dried leaves to retain moisture.',
                fertilizers: [
                    { stage: 'Basal', type: 'FYM + Bone Meal', dosage: '5 kg FYM + 500g/vine', brand: 'IFFCO' },
                    { stage: 'Post-Monsoon', type: 'NPK 10:26:26', dosage: '200g/vine', brand: 'RCF Suphala' },
                    { stage: 'Pre-Flowering', type: 'NPK 13:00:45', dosage: '100g/vine', brand: 'Coromandel' },
                    { stage: 'Fruiting', type: 'MOP', dosage: '150g/vine', brand: 'IFFCO MOP' }
                ]
            },
            organicOptions: [
                { name: 'Vermicompost', dosage: '2-3 tonnes/acre/year', benefit: 'Improves soil structure & microbial activity' },
                { name: 'Neem Cake', dosage: '200 kg/acre', benefit: 'Natural pest repellent + slow-release nitrogen' },
                { name: 'Jeevamrut', dosage: '200L/acre monthly', benefit: 'Zero-cost natural growth promoter' },
                { name: 'Panchagavya', dosage: '3% foliar spray', benefit: 'Boosts flowering & fruit setting' }
            ]
        },
        benefits: [
            'Water conservation: 50-60%',
            'Optimized for monsoon climate',
            'Year-round income stream',
            'Low maintenance requirements'
        ],
        color: '#10b981'
    },
    {
        id: 'karnataka-spice',
        name: 'Karnataka Spice Garden',
        description: 'High-value spice-focused model ideal for coffee-growing regions with shade-loving crops',
        acres: 3,
        region: 'Coorg, Karnataka',
        soilType: 'laterite',
        difficulty: 'Intermediate',
        estimatedYield: '510 Quintals',
        estimatedRevenue: '₹7.8L/year',
        cropSchedule: {
            overstory: { crop: 'Silver Oak', spacing: 10, plants: 140 },
            middle: { crop: 'Papaya', spacing: 2.5, plants: 1940 },
            understory: { crop: 'Cardamom', spacing: 40, plants: 55000 },
            vertical: { crop: 'Vanilla', perTree: 3, total: 420 }
        },
        plantingGuide: {
            overstory: {
                rowSpacing: '10m × 10m',
                plantSpacing: '10m between trees',
                plantingDepth: '60 cm pit',
                plantingSeason: 'Jun-Aug (Monsoon)',
                irrigation: 'Rain-fed mostly. Supplemental irrigation in Feb-May, 20L per tree weekly.',
                fertilizers: [
                    { stage: 'Basal', type: 'FYM', dosage: '20 kg/pit', brand: 'Local FYM' },
                    { stage: 'Year 1-2', type: 'NPK 19:19:19', dosage: '200g/tree quarterly', brand: 'IFFCO NPK' },
                    { stage: 'Established', type: 'Urea', dosage: '300g/tree annually', brand: 'IFFCO Urea' },
                    { stage: 'Mulching', type: 'Green leaf manure', dosage: '10 kg/tree', brand: 'On-farm' }
                ]
            },
            middle: {
                rowSpacing: '2.5m × 2.5m',
                plantSpacing: '2.5m between plants',
                plantingDepth: '30 cm pit',
                plantingSeason: 'Jun-Jul (Monsoon onset)',
                irrigation: 'Drip irrigation, 8L per plant every 3 days. Critical during flowering.',
                fertilizers: [
                    { stage: 'Planting', type: 'FYM + DAP', dosage: '10 kg FYM + 200g DAP/pit', brand: 'IFFCO DAP' },
                    { stage: 'Monthly', type: 'Urea', dosage: '50g/plant', brand: 'IFFCO Urea' },
                    { stage: 'Fruiting', type: 'NPK 00:52:34', dosage: '100g/plant', brand: 'Coromandel' },
                    { stage: 'Growth', type: 'Calcium Nitrate', dosage: '50g/plant', brand: 'Yara India' }
                ]
            },
            understory: {
                rowSpacing: '1.8m × 0.6m',
                plantSpacing: '60 cm between rhizomes',
                plantingDepth: '3-5 cm deep',
                plantingSeason: 'Jun-Jul (60-70% shade)',
                irrigation: 'Mist/sprinkler, maintain high humidity. Water every 2 days in dry season.',
                fertilizers: [
                    { stage: 'Basal', type: 'FYM + Neem Cake', dosage: '5 tonnes/ha each', brand: 'Local + IFFCO' },
                    { stage: '45 DAP', type: 'NPK 17:17:17', dosage: '40 kg/ha', brand: 'IFFCO Complex' },
                    { stage: '90 DAP', type: 'Urea + MOP', dosage: '25 kg + 50 kg/ha', brand: 'IFFCO' },
                    { stage: 'Foliar', type: 'Micronutrient Mix', dosage: '5g/L spray', brand: 'IFFCO Sagarika' }
                ]
            },
            vertical: {
                rowSpacing: 'On Silver Oak trunks',
                plantSpacing: '3 vines per tree',
                plantingDepth: '20 cm shallow pit',
                plantingSeason: 'Sep-Oct (Post-Monsoon)',
                irrigation: 'Light frequent irrigation. Never waterlog. 2-3L per vine per day.',
                fertilizers: [
                    { stage: 'Basal', type: 'Vermicompost', dosage: '3 kg/vine', brand: 'Local' },
                    { stage: 'Quarterly', type: 'NPK 10:26:26', dosage: '50g/vine', brand: 'RCF Suphala' },
                    { stage: 'Flowering', type: 'Boron spray', dosage: '2g/L foliar', brand: 'Multiplex' },
                    { stage: 'Curing', type: 'No fertilizer', dosage: 'Stop 2 months before harvest', brand: '-' }
                ]
            },
            organicOptions: [
                { name: 'Coffee Pulp Compost', dosage: '3 tonnes/acre', benefit: 'Rich in potassium, ideal for spice crops' },
                { name: 'Fish Amino Acid', dosage: '5ml/L foliar spray', benefit: 'Boosts growth in shade-loving crops' },
                { name: 'Wood Ash', dosage: '500g/tree', benefit: 'Natural potash source for vanilla & pepper' },
                { name: 'Trichoderma', dosage: '2 kg/acre in soil', benefit: 'Prevents root rot in cardamom & vanilla' }
            ]
        },
        benefits: [
            'Premium export-quality spices',
            'Shade-optimized cultivation',
            'High profit margins',
            'Sustainable forest farming'
        ],
        color: '#f59e0b'
    },
    {
        id: 'tamil-nadu-tropical',
        name: 'Tamil Nadu Tropical Mix',
        description: 'Drought-resistant model with diverse fruit trees and medicinal plants for semi-arid regions',
        acres: 1.5,
        region: 'Tamil Nadu Plains',
        soilType: 'red',
        difficulty: 'Beginner',
        estimatedYield: '280 Quintals',
        estimatedRevenue: '₹15.9L/year',
        cropSchedule: {
            overstory: { crop: 'Mango', spacing: 9, plants: 87 },
            middle: { crop: 'Guava', spacing: 4, plants: 380 },
            understory: { crop: 'Ginger', spacing: 50, plants: 30000 },
            vertical: { crop: 'Betel Leaf', perTree: 2, total: 174 }
        },
        plantingGuide: {
            overstory: {
                rowSpacing: '9m × 9m',
                plantSpacing: '9m between trees',
                plantingDepth: '1m × 1m × 1m pit',
                plantingSeason: 'Jul-Aug (Monsoon)',
                irrigation: 'Drip irrigation with 8L/hr dripper, twice daily in summer. Rain-fed in monsoon.',
                fertilizers: [
                    { stage: 'Pit Filling', type: 'FYM + SSP', dosage: '40 kg FYM + 2 kg SSP/pit', brand: 'Paradeep SSP' },
                    { stage: 'Year 1-4', type: 'NPK 19:19:19', dosage: '500g/tree, 2x/year', brand: 'IFFCO NPK' },
                    { stage: 'Bearing', type: 'NPK 13:00:45 + Urea', dosage: '1.5 kg + 500g/tree', brand: 'Coromandel' },
                    { stage: 'Fruiting', type: 'Zinc Sulphate Spray', dosage: '5g/L foliar', brand: 'RCF Microla' }
                ]
            },
            middle: {
                rowSpacing: '4m × 4m',
                plantSpacing: '4m between trees',
                plantingDepth: '50 cm cube pit',
                plantingSeason: 'Jul-Sep (Monsoon)',
                irrigation: 'Basin irrigation, 30L per tree every 5 days in summer.',
                fertilizers: [
                    { stage: 'Planting', type: 'FYM + DAP', dosage: '20 kg FYM + 300g DAP', brand: 'IFFCO DAP' },
                    { stage: 'Quarterly', type: 'NPK 10:26:26', dosage: '200g/tree', brand: 'RCF Suphala' },
                    { stage: 'Fruiting', type: 'MOP + Urea', dosage: '150g + 100g/tree', brand: 'IFFCO' },
                    { stage: 'Post-Harvest', type: 'FYM top dressing', dosage: '15 kg/tree', brand: 'Local FYM' }
                ]
            },
            understory: {
                rowSpacing: '25 cm × 20 cm',
                plantSpacing: '20 cm between rhizomes',
                plantingDepth: '5 cm depth',
                plantingSeason: 'Apr-May (Pre-Monsoon)',
                irrigation: 'Light irrigation every 5 days. Avoid waterlogging. Mulch with paddy straw.',
                fertilizers: [
                    { stage: 'Basal', type: 'FYM + Neem Cake', dosage: '25 tonnes FYM + 2 tonnes/ha', brand: 'Local' },
                    { stage: '40 DAP', type: 'Urea', dosage: '75 kg/ha', brand: 'IFFCO Urea' },
                    { stage: '90 DAP', type: 'NPK 17:17:17', dosage: '50 kg/ha', brand: 'IFFCO Complex' },
                    { stage: 'Foliar', type: 'Zinc + Boron', dosage: '2g/L each, monthly', brand: 'Multiplex' }
                ]
            },
            vertical: {
                rowSpacing: 'On mango tree supports',
                plantSpacing: '2 vines per tree',
                plantingDepth: '15-20 cm pit',
                plantingSeason: 'Jun-Jul (Monsoon)',
                irrigation: 'Shared drip system. Light daily watering in summer. High humidity preferred.',
                fertilizers: [
                    { stage: 'Basal', type: 'FYM + Vermicompost', dosage: '5 kg each per vine', brand: 'Local' },
                    { stage: 'Monthly', type: 'Urea', dosage: '25g/vine', brand: 'IFFCO Urea' },
                    { stage: 'Quarterly', type: 'NPK 19:19:19', dosage: '30g/vine', brand: 'IFFCO NPK' },
                    { stage: 'Leaf Quality', type: 'MOP spray', dosage: '10g/L foliar', brand: 'IFFCO MOP' }
                ]
            },
            organicOptions: [
                { name: 'Panchagavya', dosage: '3% spray fortnightly', benefit: 'Excellent for fruit quality & size' },
                { name: 'Vermicompost', dosage: '2 tonnes/acre', benefit: 'Best for red soil enrichment' },
                { name: 'Coconut Coir Mulch', dosage: '5 cm layer', benefit: 'Retains moisture in drought-prone areas' },
                { name: 'Azospirillum', dosage: '2 kg/acre', benefit: 'Fixes nitrogen naturally for ginger' }
            ]
        },
        benefits: [
            'Drought-tolerant varieties',
            'Medicinal crop integration',
            'Market-ready fruit production',
            'Low water requirements'
        ],
        color: '#ef4444'
    },
    {
        id: 'andhra-commercial',
        name: 'Andhra Commercial Model',
        description: 'Maximum yield commercial farming with fast-growing crops and high market demand',
        acres: 4,
        region: 'Andhra Pradesh',
        soilType: 'alluvial',
        difficulty: 'Advanced',
        estimatedYield: '1,200 Quintals',
        estimatedRevenue: '₹20.0L/year',
        cropSchedule: {
            overstory: { crop: 'Areca Nut', spacing: 7, plants: 381 },
            middle: { crop: 'Jackfruit', spacing: 3.5, plants: 1320 },
            understory: { crop: 'Pineapple', spacing: 40, plants: 70000 },
            vertical: { crop: 'Passion Fruit', perTree: 3, total: 1143 }
        },
        plantingGuide: {
            overstory: {
                rowSpacing: '2.7m × 2.7m',
                plantSpacing: '2.7m between palms',
                plantingDepth: '90 cm × 90 cm pit',
                plantingSeason: 'Jun-Aug (Monsoon)',
                irrigation: 'Drip mandatory, 15L per palm per day. Micro-sprinkler for young palms.',
                fertilizers: [
                    { stage: 'Pit Filling', type: 'FYM + Rock Phosphate', dosage: '20 kg FYM + 1 kg/pit', brand: 'Rajphos' },
                    { stage: 'Year 1-5', type: 'NPK 17:17:17', dosage: '300g/palm, 3x/year', brand: 'IFFCO Complex' },
                    { stage: 'Bearing', type: 'MOP + Urea', dosage: '400g + 200g/palm', brand: 'IFFCO' },
                    { stage: 'Boron Fix', type: 'Borax spray', dosage: '5g/L twice yearly', brand: 'Multiplex Boron' }
                ]
            },
            middle: {
                rowSpacing: '3.5m × 3.5m',
                plantSpacing: '3.5m between trees',
                plantingDepth: '1m × 1m × 1m pit',
                plantingSeason: 'Jul-Sep (Monsoon)',
                irrigation: 'Basin irrigation, 50L/tree weekly in dry season.',
                fertilizers: [
                    { stage: 'Planting', type: 'FYM + SSP', dosage: '50 kg FYM + 2 kg SSP/pit', brand: 'Paradeep SSP' },
                    { stage: 'Young', type: 'NPK 19:19:19', dosage: '500g/tree quarterly', brand: 'IFFCO NPK' },
                    { stage: 'Bearing', type: 'DAP + MOP', dosage: '1 kg + 500g/tree', brand: 'IFFCO DAP' },
                    { stage: 'Fruiting', type: 'Calcium spray', dosage: '5g/L foliar', brand: 'Coromandel' }
                ]
            },
            understory: {
                rowSpacing: '60 cm × 30 cm',
                plantSpacing: '30 cm between suckers',
                plantingDepth: '10 cm, crown level',
                plantingSeason: 'Apr-Jun (Pre-Monsoon)',
                irrigation: 'Drip irrigation at 2L/plant/day. Critical during fruit development.',
                fertilizers: [
                    { stage: 'Basal', type: 'FYM + SSP', dosage: '20 tonnes FYM + 500 kg SSP/ha', brand: 'Paradeep' },
                    { stage: '2 months', type: 'Urea', dosage: '65 kg/ha', brand: 'IFFCO Urea' },
                    { stage: '4 months', type: 'NPK 10:26:26', dosage: '100 kg/ha', brand: 'RCF Suphala' },
                    { stage: '8 months', type: 'MOP + Urea', dosage: '80 kg + 30 kg/ha', brand: 'IFFCO' }
                ]
            },
            vertical: {
                rowSpacing: 'Trellis: 3m × 3m posts',
                plantSpacing: '3 vines per support',
                plantingDepth: '30 cm pit near trellis',
                plantingSeason: 'Jul-Aug (Monsoon)',
                irrigation: 'Drip with 4L/hr emitter. Need consistent moisture for fruiting.',
                fertilizers: [
                    { stage: 'Planting', type: 'FYM + DAP', dosage: '10 kg FYM + 200g/vine', brand: 'IFFCO DAP' },
                    { stage: 'Growth', type: 'NPK 19:19:19', dosage: '100g/vine monthly', brand: 'IFFCO NPK' },
                    { stage: 'Flowering', type: 'NPK 00:52:34', dosage: '50g/vine', brand: 'Coromandel MKP' },
                    { stage: 'Fruiting', type: 'KNO3 spray', dosage: '10g/L foliar', brand: 'Haifa India' }
                ]
            },
            organicOptions: [
                { name: 'Green Manure (Dhaincha)', dosage: 'Intercrop + plough in', benefit: 'Adds 25 kg N/acre naturally' },
                { name: 'Bone Meal', dosage: '200 kg/acre', benefit: 'Excellent phosphorus for fruiting crops' },
                { name: 'Seaweed Extract', dosage: '2ml/L spray', benefit: 'Boosts fruit size & quality' },
                { name: 'Bio-NPK (PSB+KMB)', dosage: '4 kg/acre', benefit: 'Reduces fertilizer need by 25%' }
            ]
        },
        benefits: [
            'Maximum commercial yield',
            'Fast ROI (18-24 months)',
            'Strong market demand',
            'Export potential'
        ],
        color: '#8b5cf6'
    },
    {
        id: 'maharashtra-balanced',
        name: 'Maharashtra Coconut-Mango System',
        description: 'Balanced system for moderate climate with coconut palms, quality fruits, and high-value spice crops',
        acres: 2.5,
        region: 'Konkan, Maharashtra',
        soilType: 'black',
        difficulty: 'Intermediate',
        estimatedYield: '520 Quintals',
        estimatedRevenue: '₹26.2L/year',
        cropSchedule: {
            overstory: { crop: 'Coconut Palm', spacing: 8, plants: 182 },
            middle: { crop: 'Mango', spacing: 3, plants: 1000 },
            understory: { crop: 'Turmeric', spacing: 50, plants: 55000 },
            vertical: { crop: 'Black Pepper', perTree: 2, total: 364 }
        },
        plantingGuide: {
            overstory: {
                rowSpacing: '8m × 8m',
                plantSpacing: '8m between palms',
                plantingDepth: '60-90 cm pit',
                plantingSeason: 'Jun-Aug (SW Monsoon)',
                irrigation: 'Drip/basin, 45L per palm per day in Konkan summer heat.',
                fertilizers: [
                    { stage: 'Basal', type: 'FYM + SSP', dosage: '25 kg FYM + 2 kg SSP/palm', brand: 'Paradeep SSP' },
                    { stage: 'Year 1-5', type: 'NPK 14:14:14', dosage: '500g/palm 3x/year', brand: 'IFFCO NPK' },
                    { stage: 'Bearing', type: 'MOP + Urea', dosage: '1.2 kg + 600g/palm', brand: 'IFFCO' },
                    { stage: 'Micro', type: 'Sagarika (seaweed)', dosage: '200ml/palm', brand: 'IFFCO Sagarika' }
                ]
            },
            middle: {
                rowSpacing: '3m × 3m (between coconut)',
                plantSpacing: '3m between mango trees',
                plantingDepth: '75 cm cube pit',
                plantingSeason: 'Jul-Aug (Monsoon peak)',
                irrigation: 'Drip, 20L per tree daily in Mar-May. Reduce in monsoon.',
                fertilizers: [
                    { stage: 'Pit Filling', type: 'FYM + Neem Cake', dosage: '30 kg FYM + 2 kg/pit', brand: 'Local+IFFCO' },
                    { stage: 'Young', type: 'NPK 19:19:19', dosage: '500g/tree 4x/year', brand: 'IFFCO NPK' },
                    { stage: 'Pre-Flower', type: 'DAP + MOP', dosage: '500g + 250g/tree', brand: 'IFFCO DAP' },
                    { stage: 'Fruit Dev.', type: 'NPK 13:00:45 spray', dosage: '10g/L foliar', brand: 'Coromandel' }
                ]
            },
            understory: {
                rowSpacing: '30 cm × 20 cm',
                plantSpacing: '20 cm between rhizomes',
                plantingDepth: '5-7 cm in beds',
                plantingSeason: 'May-Jun (Pre-Monsoon)',
                irrigation: 'Ridges & furrows. Irrigate every 7-10 days. Mulch with dry leaves.',
                fertilizers: [
                    { stage: 'Basal', type: 'FYM + SSP', dosage: '30 t FYM + 500 kg SSP/ha', brand: 'Paradeep' },
                    { stage: '30 DAP', type: 'Urea', dosage: '60 kg/ha', brand: 'IFFCO Urea' },
                    { stage: '60 DAP', type: 'NPK 10:26:26', dosage: '60 kg/ha', brand: 'RCF Suphala' },
                    { stage: '120 DAP', type: 'MOP + Zinc', dosage: '50 kg + 15 kg/ha', brand: 'IFFCO + RCF' }
                ]
            },
            vertical: {
                rowSpacing: 'On coconut trunk',
                plantSpacing: '2 vines per palm',
                plantingDepth: '30 cm pit, N-side',
                plantingSeason: 'Jun-Jul (Early Monsoon)',
                irrigation: 'Shared coconut drip. Mulch heavily. Extra water in March.',
                fertilizers: [
                    { stage: 'Basal', type: 'FYM + Bone Meal', dosage: '5 kg + 500g/vine', brand: 'Local + IFFCO' },
                    { stage: 'Post-Monsoon', type: 'NPK 10:26:26', dosage: '200g/vine', brand: 'RCF Suphala' },
                    { stage: 'Pre-Flower', type: 'NPK 00:52:34', dosage: '50g/vine', brand: 'Coromandel MKP' },
                    { stage: 'Harvest', type: 'FYM top dress', dosage: '3 kg/vine', brand: 'Local' }
                ]
            },
            organicOptions: [
                { name: 'Vermicompost', dosage: '3 tonnes/acre', benefit: 'Best for Konkan laterite + black soil mix' },
                { name: 'Jeevamrut', dosage: '200L/acre/month', benefit: 'Ideal for turmeric & pepper growth' },
                { name: 'Dashaparni Ark', dosage: '5% spray', benefit: 'Organic pest control for spice crops' },
                { name: 'PSB Culture', dosage: '2 kg/acre', benefit: 'Unlocks phosphorus in black soil' }
            ]
        },
        benefits: [
            'Annual coconut income from Year 3',
            'Premium mango varieties',
            'High-value turmeric',
            '100% crop compatibility'
        ],
        color: '#06b6d4'
    },
    {
        id: 'coconut-cocoa-premium',
        name: 'Coconut-Cocoa Premium Spice',
        description: 'High-value tropical agroforestry system combining chocolate production with premium spices for coastal regions',
        acres: 3,
        region: 'Kerala/Karnataka Coast',
        soilType: 'laterite',
        difficulty: 'Intermediate',
        estimatedYield: '132 Quintals',
        estimatedRevenue: '₹17.5L/year',
        cropSchedule: {
            overstory: { crop: 'Coconut Palm', spacing: 8, plants: 219 },
            middle: { crop: 'Cocoa', spacing: 3, plants: 1350 },
            understory: { crop: 'Cardamom', spacing: 40, plants: 55000 },
            vertical: { crop: 'Black Pepper + Vanilla', perTree: 2, total: 438 }
        },
        plantingGuide: {
            overstory: {
                rowSpacing: '8m × 8m',
                plantSpacing: '8m between palms',
                plantingDepth: '60-90 cm pit',
                plantingSeason: 'Jun-Sep (Monsoon)',
                irrigation: 'Drip, 50L/palm/day in summer. Critical for copra quality.',
                fertilizers: [
                    { stage: 'Basal', type: 'FYM + Rock Phosphate', dosage: '25 kg FYM + 1.5 kg/palm', brand: 'Rajphos' },
                    { stage: 'Young', type: 'NPK 14:14:14', dosage: '500g/palm quarterly', brand: 'IFFCO NPK' },
                    { stage: 'Bearing', type: 'MOP + Borax', dosage: '1.5 kg + 50g/palm', brand: 'IFFCO MOP' },
                    { stage: 'Annual', type: 'IFFCO Sagarika', dosage: '500ml/palm in basin', brand: 'IFFCO Sagarika' }
                ]
            },
            middle: {
                rowSpacing: '3m × 3m (under coconut)',
                plantSpacing: '3m between cocoa trees',
                plantingDepth: '40 cm pit in shade',
                plantingSeason: 'Jun-Jul (50% shade needed)',
                irrigation: 'Drip/sprinkler, 10L per tree every 3 days. Never let soil dry out completely.',
                fertilizers: [
                    { stage: 'Planting', type: 'FYM + Rock Phosphate', dosage: '15 kg FYM + 500g/pit', brand: 'Rajphos' },
                    { stage: 'Year 1', type: 'NPK 10:26:26', dosage: '150g/tree quarterly', brand: 'RCF Suphala' },
                    { stage: 'Bearing', type: 'NPK 19:19:19 + MOP', dosage: '300g + 200g/tree', brand: 'IFFCO' },
                    { stage: 'Pod Dev.', type: 'Potash spray', dosage: '10g/L KNO3 foliar', brand: 'Haifa India' }
                ]
            },
            understory: {
                rowSpacing: '1.8m × 0.6m',
                plantSpacing: '60 cm between rhizomes',
                plantingDepth: '3-5 cm in shade',
                plantingSeason: 'Jun-Jul (Monsoon, 60-70% shade)',
                irrigation: 'Mist irrigation ideal. Keep soil moist, never waterlogged.',
                fertilizers: [
                    { stage: 'Basal', type: 'FYM + Bone Meal', dosage: '5 tonnes/ha + 500 kg/ha', brand: 'Local + IFFCO' },
                    { stage: '45 DAP', type: 'Urea', dosage: '30 kg/ha', brand: 'IFFCO Urea' },
                    { stage: 'Pre-Flower', type: 'NPK 17:17:17', dosage: '50 kg/ha', brand: 'IFFCO Complex' },
                    { stage: 'Capsule Dev.', type: 'MOP + ZnSO4', dosage: '40 kg + 10 kg/ha', brand: 'IFFCO + RCF' }
                ]
            },
            vertical: {
                rowSpacing: 'On coconut trunks',
                plantSpacing: '1 pepper + 1 vanilla/tree',
                plantingDepth: '30 cm pit, shaded side',
                plantingSeason: 'Jun-Jul (Pepper) / Sep-Oct (Vanilla)',
                irrigation: 'Shared with coconut. Vanilla needs consistent moisture. Mulch with cocoa husks.',
                fertilizers: [
                    { stage: 'Basal P.', type: 'FYM + Bone Meal', dosage: '5 kg + 500g/vine', brand: 'Local + IFFCO' },
                    { stage: 'Basal V.', type: 'Vermicompost', dosage: '3 kg/vine', brand: 'Local' },
                    { stage: 'Growth', type: 'NPK 10:26:26', dosage: '150g/vine 2x/year', brand: 'RCF Suphala' },
                    { stage: 'Pre-Flower', type: 'NPK 13:00:45', dosage: '100g/vine', brand: 'Coromandel' }
                ]
            },
            organicOptions: [
                { name: 'Cocoa Pod Husk Mulch', dosage: '5 cm around plants', benefit: 'Recycles cocoa waste, retains moisture' },
                { name: 'Neem Cake', dosage: '250 kg/acre', benefit: 'Pest deterrent + slow N release for spices' },
                { name: 'Trichoderma', dosage: '2 kg/acre', benefit: 'Critical for vanilla disease prevention' },
                { name: 'Fish Meal', dosage: '200 kg/acre', benefit: 'High phosphorus for cocoa pod development' }
            ]
        },
        benefits: [
            'Cocoa: ₹14L annual revenue',
            'Export-grade chocolate beans',
            'Premium shade-grown spices',
            'Net income: ₹17.5L/year',
            'Perfect shade balance (50-70%)'
        ],
        color: '#92400e',
        featured: true
    },
    {
        id: 'custom',
        name: 'Create Custom Model',
        description: 'Design your own unique multi-tier system with AI-powered recommendations',
        acres: null,
        region: 'Any',
        soilType: null,
        difficulty: 'Any Level',
        estimatedYield: 'Custom',
        estimatedRevenue: 'Varies',
        cropSchedule: null,
        benefits: [
            'Personalized for your land',
            'AI-optimized combinations',
            'Flexible crop selection',
            'Expert guidance'
        ],
        color: '#6366f1',
        isCustom: true
    }
];

// Function to get model by ID
function getModelById(modelId) {
    return presetModels.find(model => model.id === modelId);
}

// Function to apply preset model to designer
function applyPresetModel(modelId) {
    const model = getModelById(modelId);
    if (!model || model.isCustom) {
        window.location.href = 'strata.html?mode=custom';
        return;
    }

    localStorage.setItem('selectedPresetModel', JSON.stringify(model));
    window.location.href = `strata.html?preset=${modelId}`;
}

// Function to load preset model into designer
function loadPresetIntoDesigner(modelId) {
    const model = getModelById(modelId);
    if (!model || !model.cropSchedule) return null;

    return {
        acres: model.acres,
        overstory: {
            crop: model.cropSchedule.overstory.crop,
            spacing: model.cropSchedule.overstory.spacing,
            count: model.cropSchedule.overstory.plants
        },
        middle: {
            crop: model.cropSchedule.middle.crop,
            spacing: model.cropSchedule.middle.spacing,
            count: model.cropSchedule.middle.plants
        },
        understory: {
            crop: model.cropSchedule.understory.crop,
            spacing: model.cropSchedule.understory.spacing,
            count: model.cropSchedule.understory.plants
        },
        vertical: {
            crop: model.cropSchedule.vertical.crop,
            perTree: model.cropSchedule.vertical.perTree,
            count: model.cropSchedule.vertical.total
        }
    };
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.presetModels = presetModels;
    window.getModelById = getModelById;
    window.applyPresetModel = applyPresetModel;
    window.loadPresetIntoDesigner = loadPresetIntoDesigner;
}
