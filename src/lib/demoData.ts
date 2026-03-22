import { TemplateData } from './templates';

interface ProjectPreset {
    rooms: { name: string; square_footage: number }[];
    lineItems: { item_name: string; budgetPercent: number }[];
}

const PROJECT_PRESETS: Record<string, ProjectPreset> = {
    '2BHK Apartment': {
        rooms: [
            { name: 'Living Room', square_footage: 250 },
            { name: 'Master Bedroom', square_footage: 180 },
            { name: 'Bedroom 2', square_footage: 140 },
            { name: 'Kitchen', square_footage: 100 },
            { name: 'Bathroom', square_footage: 50 },
        ],
        lineItems: [
            { item_name: 'False Ceiling - POP with LED cove lighting', budgetPercent: 0.12 },
            { item_name: 'Modular Kitchen - L-shaped with chimney', budgetPercent: 0.22 },
            { item_name: 'TV Unit - wall-mounted with backlit panel', budgetPercent: 0.08 },
            { item_name: 'Wardrobe - sliding door, laminate finish', budgetPercent: 0.14 },
            { item_name: 'Flooring - vitrified tiles (all rooms)', budgetPercent: 0.10 },
            { item_name: 'Wall Painting - Asian Paints Royale (2-coat)', budgetPercent: 0.07 },
            { item_name: 'Electrical Work - points, switches, wiring', budgetPercent: 0.06 },
            { item_name: 'Sofa Set - 3+1+1 fabric upholstered', budgetPercent: 0.09 },
            { item_name: 'Dining Table - 4 seater with chairs', budgetPercent: 0.05 },
            { item_name: 'Curtains & Blinds - all windows', budgetPercent: 0.04 },
            { item_name: 'Design Consultation & 3D Visualization', budgetPercent: 0.03 },
        ],
    },
    '3BHK Apartment': {
        rooms: [
            { name: 'Living Room', square_footage: 320 },
            { name: 'Master Bedroom', square_footage: 220 },
            { name: 'Bedroom 2', square_footage: 160 },
            { name: 'Bedroom 3', square_footage: 140 },
            { name: 'Kitchen', square_footage: 120 },
            { name: 'Balcony', square_footage: 60 },
            { name: 'Bathroom (x2)', square_footage: 90 },
        ],
        lineItems: [
            { item_name: 'False Ceiling - POP with cove + spot lights', budgetPercent: 0.11 },
            { item_name: 'Modular Kitchen - U-shape with island prep area', budgetPercent: 0.20 },
            { item_name: 'TV Unit - full wall entertainment unit', budgetPercent: 0.07 },
            { item_name: 'Master Wardrobe - walk-in style with mirror', budgetPercent: 0.10 },
            { item_name: 'Wardrobe (Bedroom 2 & 3) - swing door', budgetPercent: 0.08 },
            { item_name: 'Flooring - Italian marble / vitrified tiles', budgetPercent: 0.10 },
            { item_name: 'Wall Painting - texture + accent walls', budgetPercent: 0.06 },
            { item_name: 'Electrical & Plumbing upgrade', budgetPercent: 0.06 },
            { item_name: 'Living Room Furniture - sofa, center table, rug', budgetPercent: 0.08 },
            { item_name: 'Dining Set - 6 seater with crockery unit', budgetPercent: 0.05 },
            { item_name: 'Curtains, Blinds & Soft Furnishings', budgetPercent: 0.04 },
            { item_name: 'Design Consultation & 3D Visualization', budgetPercent: 0.03 },
            { item_name: 'Project Management & Site Supervision', budgetPercent: 0.02 },
        ],
    },
    'Villa / Bungalow': {
        rooms: [
            { name: 'Living & Dining Hall', square_footage: 500 },
            { name: 'Master Bedroom Suite', square_footage: 300 },
            { name: 'Bedroom 2', square_footage: 200 },
            { name: 'Bedroom 3', square_footage: 200 },
            { name: 'Study / Home Office', square_footage: 120 },
            { name: 'Kitchen', square_footage: 180 },
            { name: 'Entrance & Foyer', square_footage: 80 },
            { name: 'Garden / Outdoor', square_footage: 250 },
        ],
        lineItems: [
            { item_name: 'False Ceiling - multi-level POP + chandeliers', budgetPercent: 0.10 },
            { item_name: 'Modular Kitchen - premium island kitchen', budgetPercent: 0.15 },
            { item_name: 'Living Room Furniture - premium sofa set, rug, decor', budgetPercent: 0.10 },
            { item_name: 'Wardrobes - all bedrooms (premium laminate)', budgetPercent: 0.10 },
            { item_name: 'Flooring - Italian marble, wooden flooring', budgetPercent: 0.12 },
            { item_name: 'Wall Treatments - wallpaper, stone cladding, texture', budgetPercent: 0.07 },
            { item_name: 'Dining Area - 8 seater table + crockery display', budgetPercent: 0.05 },
            { item_name: 'Study/Office - desk, bookshelf, seating', budgetPercent: 0.04 },
            { item_name: 'Electrical, Smart Home & Lighting plan', budgetPercent: 0.07 },
            { item_name: 'Entrance & Foyer - console, mirror, shoe rack', budgetPercent: 0.03 },
            { item_name: 'Garden / Outdoor seating & landscaping', budgetPercent: 0.05 },
            { item_name: 'Curtains, Blinds & Accessories', budgetPercent: 0.04 },
            { item_name: 'Design, 3D Visualization & Project Management', budgetPercent: 0.05 },
            { item_name: 'Bathroom Renovation (x3) - fixtures, tiles', budgetPercent: 0.03 },
        ],
    },
    'Office Space': {
        rooms: [
            { name: 'Reception', square_footage: 150 },
            { name: 'Open Workstation Area', square_footage: 400 },
            { name: 'Cabin (x2)', square_footage: 180 },
            { name: 'Conference Room', square_footage: 200 },
            { name: 'Pantry / Break Room', square_footage: 100 },
            { name: 'Server / Storage Room', square_footage: 60 },
        ],
        lineItems: [
            { item_name: 'Reception Desk - branded with backlit logo', budgetPercent: 0.08 },
            { item_name: 'Workstations - modular desks with partitions (x10)', budgetPercent: 0.18 },
            { item_name: 'Cabin Furniture - executive desk, chair, storage', budgetPercent: 0.10 },
            { item_name: 'Conference Table - 10 seater with chairs', budgetPercent: 0.08 },
            { item_name: 'False Ceiling - grid ceiling with LED panels', budgetPercent: 0.10 },
            { item_name: 'Flooring - carpet tiles / vinyl', budgetPercent: 0.09 },
            { item_name: 'Glass Partitions - frosted, toughened', budgetPercent: 0.08 },
            { item_name: 'Electrical & Networking - points, LAN, UPS', budgetPercent: 0.08 },
            { item_name: 'Pantry Setup - counter, cabinets, sink', budgetPercent: 0.05 },
            { item_name: 'Wall Branding & Signage', budgetPercent: 0.04 },
            { item_name: 'HVAC / AC installation', budgetPercent: 0.06 },
            { item_name: 'Design & Project Management', budgetPercent: 0.04 },
            { item_name: 'Fire Safety & Compliance', budgetPercent: 0.02 },
        ],
    },
    'Kitchen Renovation': {
        rooms: [
            { name: 'Kitchen', square_footage: 120 },
        ],
        lineItems: [
            { item_name: 'Modular Kitchen Cabinets - upper & lower (marine ply)', budgetPercent: 0.30 },
            { item_name: 'Countertop - granite / quartz', budgetPercent: 0.12 },
            { item_name: 'Kitchen Chimney - auto-clean, 1200 m3/hr', budgetPercent: 0.06 },
            { item_name: 'Built-in Hob - 4 burner', budgetPercent: 0.05 },
            { item_name: 'Sink - double bowl stainless steel with faucet', budgetPercent: 0.04 },
            { item_name: 'Wall Tiles - dado height, anti-skid', budgetPercent: 0.08 },
            { item_name: 'Flooring - anti-skid vitrified tiles', budgetPercent: 0.07 },
            { item_name: 'Tall Unit / Pantry Pull-out storage', budgetPercent: 0.08 },
            { item_name: 'Electrical - points, switches, under-cabinet LED', budgetPercent: 0.05 },
            { item_name: 'Plumbing - water supply, drainage rework', budgetPercent: 0.06 },
            { item_name: 'Accessories - basket, carousel, cutlery tray', budgetPercent: 0.05 },
            { item_name: 'Design & 3D Visualization', budgetPercent: 0.04 },
        ],
    },
    'Single Room Makeover': {
        rooms: [
            { name: 'Bedroom', square_footage: 180 },
        ],
        lineItems: [
            { item_name: 'Wardrobe - floor-to-ceiling, laminate finish', budgetPercent: 0.25 },
            { item_name: 'Bed with Storage - king size, hydraulic', budgetPercent: 0.18 },
            { item_name: 'False Ceiling - POP with cove lighting', budgetPercent: 0.12 },
            { item_name: 'Study/Work Desk - wall-mounted with shelves', budgetPercent: 0.10 },
            { item_name: 'Wall Treatment - accent wallpaper + painting', budgetPercent: 0.10 },
            { item_name: 'Flooring - wooden laminate / tiles', budgetPercent: 0.08 },
            { item_name: 'Side Tables & Dressing Unit', budgetPercent: 0.07 },
            { item_name: 'Curtains & Soft Furnishings', budgetPercent: 0.05 },
            { item_name: 'Electrical - fan, lights, switch plates', budgetPercent: 0.05 },
        ],
    },
};

export const PROJECT_TYPES = Object.keys(PROJECT_PRESETS);

export function generateDemoData(
    clientName: string,
    projectType: string,
    budget: number
): TemplateData {
    const preset = PROJECT_PRESETS[projectType] || PROJECT_PRESETS['2BHK Apartment'];

    // Generate line items from budget
    const lineItems = preset.lineItems.map(item => {
        const itemTotal = Math.round(budget * item.budgetPercent);
        return {
            item_name: item.item_name,
            quantity: 1,
            unit_price: itemTotal,
        };
    });

    const totalSqFt = preset.rooms.reduce((s, r) => s + r.square_footage, 0);

    return {
        client_name: clientName || 'Client Name',
        client_email: 'client@example.com',
        client_phone: '+91 98765 43210',
        project_address: 'Mumbai, Maharashtra',
        project_type: projectType,
        designer_name: 'Your Studio Name',
        designer_email: 'studio@example.com',
        designer_phone: '+91 99999 00000',
        logo_url: '',
        accent_color: '#2563EB',
        notes: 'This is a sample quotation generated by Kalvora. Sign up free to create and send real proposals to your clients.',
        payment_terms: '50% advance before work begins.\nBalance 50% on completion and handover.\nPrices inclusive of material, labour, and installation.',
        tax_rate: 18,
        created_at: new Date().toISOString(),
        rooms: preset.rooms,
        line_items: lineItems,
        studio_name: 'Your Studio Name',
        project_size: String(totalSqFt),
        services_included: [
            'Design Consultation',
            'Material Selection & Procurement',
            'On-site Supervision',
            '3D Visualization',
            'Project Completion & Handover',
        ],
        quotation_validity: 30,
        estimated_timeline: '8-12 weeks from approval date',
    };
}
