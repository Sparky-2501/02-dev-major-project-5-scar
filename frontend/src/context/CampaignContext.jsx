import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_CAMPAIGNS, INITIAL_AUDIT_LOGS } from '../data/campaigns';
import { DEMO_PRODUCTS } from '../data/catalog';

const CampaignContext = createContext(null);

export const CampaignProvider = ({ children }) => {
  // 1. Promotional Campaigns State
  const [campaigns, setCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem('scar_campaigns');
      return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  // 2. Audit Logs State
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('scar_audit_logs');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // 3. Dynamic Products State (allowing Manager & Admin uploads/edits)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('scar_dynamic_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Sync first 3 products if they were using older default SVG images
        return parsed.map((p) => {
          const fresh = DEMO_PRODUCTS.find((dp) => dp.id === p.id);
          if (fresh && fresh.thumbnail !== p.thumbnail && p.thumbnail.endsWith('.svg')) {
            return { ...p, thumbnail: fresh.thumbnail, images: fresh.images };
          }
          return p;
        });
      }
      return DEMO_PRODUCTS;
    } catch {
      return DEMO_PRODUCTS;
    }
  });

  // 4. Genuine Analytics Events (impressions, clicks, searches, orders)
  const [analyticsEvents, setAnalyticsEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('scar_analytics_events');
      return saved ? JSON.parse(saved) : [
        { type: 'product_view', sku: 'M1-BLK-XL', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { type: 'cart_add', sku: 'M1-BLK-XL', timestamp: new Date(Date.now() - 1800000).toISOString() },
        { type: 'campaign_click', campaignId: 'camp_elec_fest', timestamp: new Date().toISOString() },
      ];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('scar_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('scar_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('scar_dynamic_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('scar_analytics_events', JSON.stringify(analyticsEvents));
  }, [analyticsEvents]);

  // Log an audit action
  const logAuditAction = ({ actor, actionType, resourceId, resourceType, details }) => {
    const entry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      actorId: actor?.id || 'anonymous',
      actorName: actor?.name || 'Anonymous User',
      actorRole: actor?.role || 'guest',
      actionType,
      resourceId,
      resourceType,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      details,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // Track an analytics event
  const trackEvent = (eventData) => {
    const entry = {
      ...eventData,
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    setAnalyticsEvents((prev) => [entry, ...prev]);
  };

  // Helper to determine authoritative campaign discount for a given product
  const getProductDiscount = (product) => {
    const now = new Date().toISOString();
    // Find active campaigns that apply to this product
    const eligibleCampaigns = campaigns.filter((c) => {
      if (c.status !== 'active') return false;
      if (c.startDate > now || c.endDate < now) return false;

      if (c.type === 'all') return true;
      if (c.type === 'category' && c.targetCategory === product.category) return true;
      if (c.type === 'products' && Array.isArray(c.targetProductSkus)) {
        return product.variants?.some((v) => c.targetProductSkus.includes(v.sku));
      }
      return false;
    });

    if (eligibleCampaigns.length === 0) {
      return null;
    }

    // Sort by priority descending (highest priority wins)
    eligibleCampaigns.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const activeCampaign = eligibleCampaigns[0];

    // Calculate discounted price
    let discountAmount = 0;
    if (activeCampaign.discountType === 'percentage') {
      discountAmount = Math.round((product.price * activeCampaign.discountValue) / 100);
      if (activeCampaign.maxDiscount && discountAmount > activeCampaign.maxDiscount) {
        discountAmount = activeCampaign.maxDiscount;
      }
    } else {
      discountAmount = activeCampaign.discountValue;
    }

    const finalPrice = Math.max(0, product.price - discountAmount);

    return {
      campaignId: activeCampaign.id,
      campaignName: activeCampaign.name,
      headline: activeCampaign.headline,
      discountPercent: Math.round((discountAmount / product.price) * 100),
      discountAmount,
      originalPrice: product.price,
      finalPrice,
    };
  };

  // Add / Edit Product
  const saveProduct = (productData, actor) => {
    const isNew = !productData.id;
    const finalProduct = {
      ...productData,
      id: productData.id || `prod_${Date.now().toString().slice(-6)}`,
      slug: productData.slug || productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === finalProduct.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = finalProduct;
        return updated;
      }
      return [finalProduct, ...prev];
    });

    logAuditAction({
      actor,
      actionType: isNew ? 'PRODUCT_CREATE' : 'PRODUCT_UPDATE',
      resourceId: finalProduct.id,
      resourceType: 'product',
      details: `${isNew ? 'Created' : 'Updated'} product: "${finalProduct.title}" (SKU count: ${finalProduct.variants?.length || 0})`,
    });

    return finalProduct;
  };

  // Archive / Delete Product
  const archiveProduct = (productId, actor) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    logAuditAction({
      actor,
      actionType: 'PRODUCT_ARCHIVE',
      resourceId: productId,
      resourceType: 'product',
      details: `Archived/Removed product: "${prod?.title || productId}"`,
    });
  };

  // Create Campaign
  const createCampaign = (campaignData, actor, canPublish = false) => {
    const newCampaign = {
      ...campaignData,
      id: campaignData.id || `camp_${Date.now().toString().slice(-6)}`,
      status: canPublish ? (campaignData.status || 'active') : 'pending_approval',
      createdBy: actor?.name || 'Manager',
      approvedBy: canPublish ? (actor?.name || 'Administrator') : null,
      impressions: 0,
      clicks: 0,
    };

    setCampaigns((prev) => [newCampaign, ...prev]);

    logAuditAction({
      actor,
      actionType: canPublish ? 'CAMPAIGN_CREATE_AND_PUBLISH' : 'CAMPAIGN_SUBMIT_APPROVAL',
      resourceId: newCampaign.id,
      resourceType: 'campaign',
      details: `Created campaign: "${newCampaign.name}" with status: ${newCampaign.status}`,
    });

    return newCampaign;
  };

  // Update Campaign Status (Approve, Pause, Activate)
  const updateCampaignStatus = (campaignId, newStatus, actor) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: newStatus } : c))
    );

    logAuditAction({
      actor,
      actionType: 'CAMPAIGN_STATUS_CHANGE',
      resourceId: campaignId,
      resourceType: 'campaign',
      details: `Changed campaign status to ${newStatus}`,
    });
  };

  // Delete / Remove Campaign
  const deleteCampaign = (campaignId, actor) => {
    const camp = campaigns.find((c) => c.id === campaignId);
    setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));

    logAuditAction({
      actor,
      actionType: 'CAMPAIGN_DELETE',
      resourceId: campaignId,
      resourceType: 'campaign',
      details: `Deleted campaign promotion: "${camp?.name || campaignId}"`,
    });
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        products,
        auditLogs,
        analyticsEvents,
        getProductDiscount,
        saveProduct,
        archiveProduct,
        createCampaign,
        updateCampaignStatus,
        deleteCampaign,
        logAuditAction,
        trackEvent,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaigns = () => {
  const context = useContext(CampaignContext);
  if (!context) throw new Error('useCampaigns must be used within a CampaignProvider');
  return context;
};
