import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchCampaigns } from '@/store/slices/campaignSlice';
import Button from '@/components/Button';
import LoadingSpinner from '@/components/LoadingSpinner';

const CampaignsPage: React.FC = () => {
  const { campaigns, isLoading } = useAppSelector((state) => state.campaigns);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 text-dark">
            Мои кампании
          </h1>
          <p className="text-muted">
            Управляйте своими кампаниями BattleTech
          </p>
        </div>
        <Link to="/campaigns/new">
          <Button>
            Создать кампанию
          </Button>
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-3">🎮</div>
          <h3 className="h4 text-dark mb-2">
            У вас пока нет кампаний
          </h3>
          <p className="text-muted mb-4">
            Создайте свою первую кампанию и начните сражение!
          </p>
          <Link to="/campaigns/new">
            <Button size="lg">
              Создать первую кампанию
            </Button>
          </Link>
        </div>
      ) : (
        <div className="row">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h3 className="h5 text-dark mb-2">
                    {campaign.name}
                  </h3>
                  <p className="text-muted mb-3" style={{ 
                    display: '-webkit-box', 
                    WebkitLineClamp: 2, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden' 
                  }}>
                    {campaign.description}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className={`badge ${
                      campaign.status === 'active' ? 'bg-success' :
                      campaign.status === 'completed' ? 'bg-primary' :
                      'bg-warning'
                    }`}>
                      {campaign.status === 'active' ? 'Активна' :
                       campaign.status === 'completed' ? 'Завершена' : 'Приостановлена'}
                    </span>
                    <small className="text-muted">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <Link to={`/campaigns/${campaign.id}`}>
                    <Button className="w-100">
                      Открыть кампанию
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;



