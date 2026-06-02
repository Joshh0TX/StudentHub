import React from 'react';
import { ShoppingBag, Settings2, ArrowUpRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './storeTab.css';

const MyShopTab = ({ isOwner, shopProductsData, storeData, isLoading }) => {
  const navigate = useNavigate();

  // Strict UI Filter Constraint Layout Layer Rule: Limit storefront preview output to 4 items max
  const limitedProductsList = shopProductsData ? shopProductsData.slice(0, 4) : [];

  const handleStoreRedirect = () => {
    if (isOwner) {
      // Owner goes to their storefront management page
      navigate('/storefront');
    } else if (storeData?.id) {
      // Visitor goes to the public store view
      navigate(`/store/${storeData.id}`);
    } else {
      navigate('/marketplace');
    }
  };

  const handleProductEdit = (productId) => {
    navigate('/storefront');
  };

  if (isLoading) {
    return (
      <div className="my-shop-tab-wrapper">
        <div className="my-shop-tab-master-header">
          <h2>My Shop</h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0', color: 'var(--text-muted, #888)' }}>
          <Loader2 size={24} className="spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="my-shop-tab-wrapper">
      
      {/* 1. CENTRALIZED SECTION HEADER WITH ALIGNED REDIRECT LINK */}
      <div className="my-shop-tab-master-header">
        <h2>My Shop</h2>
        
        {/* NEW REPOSITIONED TOP RIGHT ACTION TRIGGER */}
        <button 
          type="button" 
          className="shop-storefront-header-redirect-btn"
          onClick={handleStoreRedirect}
        >
          <span>{isOwner ? "Manage Store" : "Visit Store"}</span>
          <ArrowUpRight className="redirect-btn-svg" />
        </button>
      </div>

      {/* Store name badge when data is available */}
      {storeData?.name && (
        <p className="shop-store-name-badge">{storeData.name}</p>
      )}

      {/* 2. DYNAMIC GRID CANVAS DISPLAY */}
      <div className="shop-products-preview-grid">
        {limitedProductsList.length > 0 ? (
          limitedProductsList.map((product) => (
            <div key={product.id} className="product-preview-card">
              
              {/* Product Thumbnail Frame Image Core */}
              <div className="product-thumbnail-frame">
                {product.image ? (
                  <img src={product.image} alt={product.title} className="product-thumbnail-image" />
                ) : (
                  <ShoppingBag size={24} strokeWidth={1.5} />
                )}

                {/* CONDITIONAL ACTION BUBBLE: Manage triggers exposed only to the Owner profile context */}
                {isOwner && (
                  <div className="product-owner-inline-action">
                    <button 
                      type="button" 
                      className="product-inline-naked-btn" 
                      onClick={() => handleProductEdit(product.id)}
                      aria-label="Manage item details"
                    >
                      <Settings2 size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* Product Text Description details */}
              <div className="product-card-details-box">
                <h4>{product.title || "Unregistered Product"}</h4>
                <p className="product-item-price-tag">{product.price || "₦0.00"}</p>
              </div>

            </div>
          ))
        ) : (
          <div className="placeholder-panel-text" style={{ gridColumn: '1 / -1', padding: '32px 0', textAlign: 'center' }}>
            {isOwner
              ? <p>You haven't listed any products yet. <button type="button" onClick={handleStoreRedirect} style={{ background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}>Go to your storefront</button> to add some.</p>
              : <p>No products listed on this storefront yet.</p>
            }
          </div>
        )}
      </div>

    </div>
  );
};

export default MyShopTab;
