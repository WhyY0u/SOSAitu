import { useEffect, useState } from 'react';
import styles from './style/Style.module.css';
import apiClient from '@/data/datasources/api/apiClient';
import ReactMarkdown from 'react-markdown';

interface Region {
    id: number;
    name: string;
}

interface City {
    id: number;
    name: string;
}

interface CityStats {
    cityName: string;
    regionName: string;
    ticketCount: number;
    avgResponseTime: number;
    satisfactionScore: number;
    aiReport: string;
}

const LocationManagement = () => {
    const [regions, setRegions] = useState<Region[]>([]);
    const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const [cityStats, setCityStats] = useState<CityStats | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadRegions();
    }, []);

    useEffect(() => {
        if (selectedRegionId) {
            loadCities(selectedRegionId);
            setCityStats(null);
            setSelectedCityId(null);
        } else {
            setCities([]);
        }
    }, [selectedRegionId]);

    useEffect(() => {
        if (selectedCityId) {
            loadCityStats(selectedCityId);
        } else {
            setCityStats(null);
        }
    }, [selectedCityId]);

    const loadRegions = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/owner/location/regions');
            setRegions(response.data);
        } catch (e) {
            console.error('Ошибка загрузки регионов:', e);
        } finally {
            setLoading(false);
        }
    };

    const loadCities = async (regionId: number) => {
        try {
            const response = await apiClient.get(`/owner/location/regions/${regionId}/cities`);
            setCities(response.data);
        } catch (e) {
            console.error('Ошибка загрузки городов:', e);
        }
    };

    const loadCityStats = async (cityId: number) => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/owner/city-stats/${cityId}`);
            setCityStats(response.data);
        } catch (e) {
            console.error('Ошибка загрузки статистики города:', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.location_management}>
            <h2 className={styles.title}>Регионы и города Казахстана</h2>

            <div className={styles.container}>
                <div className={styles.section}>
                    <h3 className={styles.section_title}>Выберите регион</h3>
                    <select
                        value={selectedRegionId ?? ''}
                        onChange={(e) => setSelectedRegionId(e.target.value ? Number(e.target.value) : null)}
                        className={styles.select}
                    >
                        <option value="">Выберите регион...</option>
                        {regions.map((region) => (
                            <option key={region.id} value={region.id}>
                                {region.name}
                            </option>
                        ))}
                    </select>
                </div>

                {cities.length > 0 && (
                    <div className={styles.section}>
                        <h3 className={styles.section_title}>Выберите город</h3>
                        <select
                            value={selectedCityId ?? ''}
                            onChange={(e) => setSelectedCityId(e.target.value ? Number(e.target.value) : null)}
                            className={styles.select}
                        >
                            <option value="">Выберите город...</option>
                            {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {selectedCityId && cityStats && (
                    <div className={styles.section}>
                        <h3 className={styles.section_title}>Статистика: {cityStats.cityName}</h3>
                        <div className={styles.stats_grid}>
                            <div className={styles.stat_card}>
                                <span className={styles.stat_label}>Тикетов</span>
                                <span className={styles.stat_value}>{cityStats.ticketCount}</span>
                            </div>
                            <div className={styles.stat_card}>
                                <span className={styles.stat_label}>Ср. время ответа (ч)</span>
                                <span className={styles.stat_value}>{cityStats.avgResponseTime.toFixed(1)}</span>
                            </div>
                            <div className={styles.stat_card}>
                                <span className={styles.stat_label}>Удовлетворенность</span>
                                <span className={styles.stat_value}>{cityStats.satisfactionScore.toFixed(1)}</span>
                            </div>
                        </div>
                        <div className={styles.ai_report}>
                            <h4 className={styles.ai_report_title}>📊 AI-отчет по городу</h4>
                            <div className={styles.ai_report_content}>
                                <ReactMarkdown>{cityStats.aiReport}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}

                {selectedRegionId && cities.length === 0 && (
                    <div className={styles.section}>
                        <p className={styles.info_text}>
                            В этом регионе нет городов (город республиканского значения)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LocationManagement;
