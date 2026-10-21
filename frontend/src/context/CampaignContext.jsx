import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_CAMPAIGNS, INITIAL_AUDIT_LOGS } from '../data/campaigns';
import { DEMO_PRODUCTS } from '../data/catalog';
import { getApiUrl } from '../utils/api';

const CampaignContext = createContext(null);

export const CampaignProvider = ({ children }) => {
  // 1. Gender Preference State ('female' | 'male' | 'all')
  const [genderPreference, setGenderPreferenceState] = useState(() => {
    try {
      return localStorage.getItem('scar_gender_preference') || 'all';
    } catch {
      return 'all';
    }
  });

  const setGenderPreference = (gender) => {
    setGenderPreferenceState(gender);
    try {
      localStorage.setItem('scar_gender_preference', gender);
    } catch {
      // ignore
    }
  };

  // 2. Promotional Discount Campaigns / Banners State
  const [campaigns, setCampaigns] = useState(() => {
    try {
      const saved = localStorage.getItem('scar_campaigns');
      return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
    } catch {
      return INITIAL_CAMPAIGNS;
    }
  });

  // 3. Dynamic Products State (allowing Manager & Admin uploads/edits)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('scar_dynamic_products');
      if (saved) {
        return JSON.parse(saved);
      }
      return DEMO_PRODUCTS;
    } catch {
      return DEMO_PRODUCTS;
    }
  });

  // 4. Audit Logs State
  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('scar_audit_logs');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // 5. Analytics Events State
  const [analyticsEvents, setAnalyticsEvents] = useState(() => {
    try {
      const saved = localStorage.getItem('scar_analytics_events');
      return saved ? JSON.parse(saved) : [
        { type: 'product_view', sku: 'M1-BLK-XL', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { type: 'cart_add', sku: 'M1-BLK-XL', timestamp: new Date(Date.now() - 1800000).toISOString() },
        { type: 'campaign_click', campaignId: 'camp_femme_couture', timestamp: new Date().toISOString() },
      ];
    } catch {
      return [];
    }
  });

  // Fetch live products from backend API
  const refreshProductsFromBackend = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl('/api/v1/products'));
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setProducts(data.data);
          localStorage.setItem('scar_dynamic_products', JSON.stringify(data.data));
        }
      }
    } catch (e) {
      // Standalone mode: keep existing local state
    }
  }, []);

  // Fetch live banners from backend API
  const refreshBannersFromBackend = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl('/api/v1/banners'));
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setCampaigns(data.data);
          localStorage.setItem('scar_campaigns', JSON.stringify(data.data));
        }
      }
    } catch (e) {
      // Standalone mode
    }
  }, []);

  useEffect(() => {
    refreshProductsFromBackend();
    refreshBannersFromBackend();
  }, [refreshProductsFromBackend, refreshBannersFromBackend]);

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
      actorName: actor?.name || 'Maison Staff',
      actorRole: actor?.role || 'staff',
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

  // Authoritative campaign discount computation
  const getProductDiscount = (product) => {
    const now = new Date().toISOString();
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

    if (eligibleCampaigns.length === 0) return null;

    eligibleCampaigns.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    const activeCampaign = eligibleCampaigns[0];

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

  // Add / Edit Product (Manager & Admin)
  const saveProduct = async (productData, actor) => {
    const isNew = !productData.id;
    const finalProduct = {
      ...productData,
      id: productData.id || `prod_${Date.now().toString(36)}`,
      slug: productData.slug || productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      genderFocus: productData.genderFocus || (productData.category === 'women' ? 'female' : productData.category === 'men' ? 'male' : 'unisex'),
      brand: productData.brand || 'SCAR Atelier',
    };

    // Optimistic UI update
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === finalProduct.id || p.slug === finalProduct.slug);
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
      details: `${isNew ? 'Created' : 'Updated'} item: "${finalProduct.title}" (Category: ${finalProduct.category}, Price: ₹${finalProduct.price})`,
    });

    // Sync to backend API
    try {
      await fetch(getApiUrl('/api/v1/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProduct),
      });
    } catch {
      // Preserved in local storage
    }

    return finalProduct;
  };

  // Delete Product Item (Manager & Admin)
  const archiveProduct = async (productId, actor) => {
    const prod = products.find((p) => p.id === productId || p.slug === productId);

    // Optimistic UI update
    setProducts((prev) => prev.filter((p) => p.id !== productId && p.slug !== productId));

    logAuditAction({
      actor,
      actionType: 'PRODUCT_ARCHIVE',
      resourceId: productId,
      resourceType: 'product',
      details: `Deleted/Removed atelier item: "${prod?.title || productId}"`,
    });

    // Sync to backend API
    try {
      await fetch(getApiUrl(`/api/v1/products/${productId}`), {
        method: 'DELETE',
      });
    } catch {
      // Handled in local storage
    }
  };

  // Add / Create Discount Banner (Manager & Admin)
  const createCampaign = async (campaignData, actor, canPublish = true) => {
    const newCampaign = {
      ...campaignData,
      id: campaignData.id || `camp_${Date.now().toString(36)}`,
      status: canPublish ? (campaignData.status || 'active') : 'pending_approval',
      createdBy: actor?.name || 'Maison Staff',
      approvedBy: canPublish ? (actor?.name || 'Administrator') : null,
      impressions: 0,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI update
    setCampaigns((prev) => [newCampaign, ...prev]);

    logAuditAction({
      actor,
      actionType: canPublish ? 'CAMPAIGN_CREATE_AND_PUBLISH' : 'CAMPAIGN_SUBMIT_APPROVAL',
      resourceId: newCampaign.id,
      resourceType: 'campaign',
      details: `Created home discount banner: "${newCampaign.name}" (${newCampaign.headline})`,
    });

    // Sync to backend API
    try {
      await fetch(getApiUrl('/api/v1/banners'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampaign),
      });
    } catch {
      // Preserved in local storage
    }

    return newCampaign;
  };

  // Delete Discount Banner (Manager & Admin)
  const deleteCampaign = async (campaignId, actor) => {
    const camp = campaigns.find((c) => c.id === campaignId);

    // Optimistic UI removal
    setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));

    logAuditAction({
      actor,
      actionType: 'CAMPAIGN_DELETE',
      resourceId: campaignId,
      resourceType: 'campaign',
      details: `Removed home discount banner: "${camp?.name || campaignId}"`,
    });

    // Sync to backend API
    try {
      await fetch(getApiUrl(`/api/v1/banners/${campaignId}`), {
        method: 'DELETE',
      });
    } catch {
      // Handled in local storage
    }
  };

  // Update Campaign Status
  const updateCampaignStatus = async (campaignId, newStatus, actor) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, status: newStatus } : c))
    );

    logAuditAction({
      actor,
      actionType: 'CAMPAIGN_STATUS_CHANGE',
      resourceId: campaignId,
      resourceType: 'campaign',
      details: `Changed banner status to ${newStatus}`,
    });

    try {
      await fetch(getApiUrl(`/api/v1/banners/${campaignId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {
      // ignore
    }
  };

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        products,
        auditLogs,
        analyticsEvents,
        genderPreference,
        setGenderPreference,
        getProductDiscount,
        saveProduct,
        archiveProduct,
        createCampaign,
        updateCampaignStatus,
        deleteCampaign,
        logAuditAction,
        trackEvent,
        refreshProductsFromBackend,
        refreshBannersFromBackend,
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
