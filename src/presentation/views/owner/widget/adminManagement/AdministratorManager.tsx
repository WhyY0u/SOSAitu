import { useEffect, useState } from 'react';
import UserApiRepository from '@/data/repositories/user/remote/ApiUserRepository';
import type { Region, City, TicketType, Administrator, AdminPerformance } from '@/domain/repositories/user/UserRepository';
import Modal from '@/shared/ui/Modal';

const AdministratorManager = () => {
    const [regions, setRegions] = useState<Region[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
    const [administrators, setAdministrators] = useState<Administrator[]>([]);
    const [adminPerformance, setAdminPerformance] = useState<AdminPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdminList, setShowAdminList] = useState(false);
    
    // Модальные окна
    const [modal, setModal] = useState<{
        isOpen: boolean;
        type: 'confirm' | 'info';
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({ isOpen: false, type: 'info', title: '', message: '' });
    
    // Форма для REGION_ADMINISTRATOR
    const [regionAdminUserId, setRegionAdminUserId] = useState<string>('');
    const [regionAdminRegionId, setRegionAdminRegionId] = useState<string>('');
    
    // Форма для CITY_ADMINISTRATOR
    const [cityAdminUserId, setCityAdminUserId] = useState<string>('');
    const [cityAdminRegionId, setCityAdminRegionId] = useState<string>('');
    const [cityAdminCityId, setCityAdminCityId] = useState<string>('');
    
    // Форма для SUPPORT
    const [supportUserId, setSupportUserId] = useState<string>('');
    const [supportRegionId, setSupportRegionId] = useState<string>('');
    const [supportCityId, setSupportCityId] = useState<string>('');
    const [supportTypes, setSupportTypes] = useState<string[]>([]);
    const [hoveredType, setHoveredType] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = new UserApiRepository();
                const [regionsData, typesData, adminsData, performanceData] = await Promise.all([
                    api.getRegions(),
                    api.getTicketTypes(),
                    api.getAdministrators(),
                    api.getAdminPerformance(),
                ]);
                setRegions(regionsData);
                setTicketTypes(typesData);
                setAdministrators(adminsData);
                setAdminPerformance(performanceData);
            } catch (err) {
                console.error('Ошибка при загрузке данных:', err);
                setModal({
                    isOpen: true,
                    type: 'info',
                    title: 'Ошибка',
                    message: 'Не удалось загрузить данные'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (cityAdminRegionId) {
            const region = regions.find(r => r.id === parseInt(cityAdminRegionId));
            setCities(region?.cities || []);
        } else {
            setCities([]);
        }
    }, [cityAdminRegionId, regions]);

    useEffect(() => {
        if (supportRegionId) {
            const region = regions.find(r => r.id === parseInt(supportRegionId));
            setCities(region?.cities || []);
        } else {
            setCities([]);
        }
    }, [supportRegionId, regions]);

    const handleAddRegionAdministrator = async () => {
        if (!regionAdminUserId || !regionAdminRegionId) {
            setModal({ isOpen: true, type: 'info', title: 'Ошибка', message: 'Введите ID пользователя и выберите регион' });
            return;
        }

        try {
            const api = new UserApiRepository();
            await api.addRegionAdministrator(
                parseInt(regionAdminUserId),
                parseInt(regionAdminRegionId)
            );
            setModal({ isOpen: true, type: 'info', title: 'Успешно', message: 'Администратор области назначен' });
            setTimeout(() => window.location.reload(), 1500);
        } catch (err: any) {
            setModal({
                isOpen: true,
                type: 'info',
                title: 'Ошибка',
                message: err.response?.data?.error || err.message
            });
        }
    };

    const handleAddCityAdministrator = async () => {
        if (!cityAdminUserId || !cityAdminRegionId || !cityAdminCityId) {
            setModal({ isOpen: true, type: 'info', title: 'Ошибка', message: 'Введите ID пользователя и выберите регион и город' });
            return;
        }

        try {
            const api = new UserApiRepository();
            await api.addCityAdministrator(
                parseInt(cityAdminUserId),
                parseInt(cityAdminRegionId),
                parseInt(cityAdminCityId)
            );
            setModal({ isOpen: true, type: 'info', title: 'Успешно', message: 'Администратор города назначен' });
            setTimeout(() => window.location.reload(), 1500);
        } catch (err: any) {
            setModal({
                isOpen: true,
                type: 'info',
                title: 'Ошибка',
                message: err.response?.data?.error || err.message
            });
        }
    };

    const handleAddSupport = async () => {
        if (!supportUserId || !supportRegionId || !supportCityId || supportTypes.length === 0) {
            setModal({ isOpen: true, type: 'info', title: 'Ошибка', message: 'Введите ID пользователя, выберите регион, город и типы тикетов' });
            return;
        }

        try {
            const api = new UserApiRepository();
            await api.addSupport(
                parseInt(supportUserId),
                parseInt(supportRegionId),
                parseInt(supportCityId),
                supportTypes
            );
            setModal({ isOpen: true, type: 'info', title: 'Успешно', message: 'Support назначен' });
            setTimeout(() => window.location.reload(), 1500);
        } catch (err: any) {
            setModal({
                isOpen: true,
                type: 'info',
                title: 'Ошибка',
                message: err.response?.data?.error || err.message
            });
        }
    };

    const handleDeleteClick = (userId: number, fullName: string) => {
        setModal({
            isOpen: true,
            type: 'confirm',
            title: 'Удаление администратора',
            message: `Вы уверены, что хотите удалить администратора "${fullName}"? Его роль будет сброшена до обычного пользователя.`,
            onConfirm: async () => {
                try {
                    const api = new UserApiRepository();
                    await api.deleteAdministrator({ userId });
                    setAdministrators(administrators.filter(a => a.userId !== userId));
                    setModal({ isOpen: true, type: 'info', title: 'Успешно', message: 'Администратор удалён' });
                } catch (err: any) {
                    setModal({
                        isOpen: true,
                        type: 'info',
                        title: 'Ошибка',
                        message: err.response?.data?.error || err.message
                    });
                }
            }
        });
    };

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Загрузка...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Модальное окно */}
            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                type={modal.type}
                onConfirm={modal.onConfirm}
            >
                <p style={{ lineHeight: 1.6 }}>{modal.message}</p>
            </Modal>

            {/* Кнопка показать/скрыть список администраторов */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                    onClick={() => setShowAdminList(!showAdminList)}
                    style={{
                        padding: '12px 24px',
                        background: showAdminList ? '#6b7280' : '#4f46e5',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'background 0.2s'
                    }}
                >
                    {showAdminList ? '🙅 Скрыть' : '👥 Показать'} ({administrators.length})
                </button>
            </div>

            {/* Список администраторов */}
            {showAdminList && (
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden'
                }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#1f2937' }}>
                            📋 Все администраторы
                        </h3>
                    </div>
                    {administrators.length === 0 ? (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                            Администраторов пока нет
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
                                <thead>
                                    <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>ID</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Имя</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Роль</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Регион</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Город</th>
                                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Типы</th>
                                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>✅ Решено</th>
                                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>⏳ В работе</th>
                                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>⏱️ Ср. время (ч)</th>
                                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>⭐ Оценка</th>
                                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Статус</th>
                                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {administrators.map((admin, index) => {
                                        const performance = adminPerformance.find(p => p.fullname === admin.fullName);
                                        return (
                                        <tr key={admin.adminId} style={{
                                            borderBottom: index < administrators.length - 1 ? '1px solid #e5e7eb' : 'none',
                                            background: index % 2 === 0 ? 'white' : '#f9fafb'
                                        }}>
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937' }}>{admin.userId}</td>
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#1f2937', fontWeight: 500 }}>{admin.fullName}</td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{
                                                    padding: '4px 12px',
                                                    borderRadius: '9999px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                    background: admin.role.includes('REGION') ? '#dbeafe' : admin.role.includes('CITY') ? '#dcfce7' : '#fef3c7',
                                                    color: admin.role.includes('REGION') ? '#1e40af' : admin.role.includes('CITY') ? '#166534' : '#92400e'
                                                }}>
                                                    {admin.role.replace('ROLE_', '')}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>{admin.region || '—'}</td>
                                            <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>{admin.city || '—'}</td>
                                            <td style={{ padding: '16px', fontSize: '13px', color: '#6b7280', maxWidth: '200px' }}>
                                                {admin.responsibleTypes.length > 0 ? (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                        {admin.responsibleTypes.map(type => (
                                                            <span key={type} style={{
                                                                padding: '2px 8px',
                                                                background: '#e5e7eb',
                                                                borderRadius: '4px',
                                                                fontSize: '11px'
                                                            }}>
                                                                {type}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : '—'}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: performance?.decided && performance.decided > 0 ? '#16a34a' : '#6b7280' }}>
                                                {performance?.decided ?? 0}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: performance?.atWork && performance.atWork > 0 ? '#f59e0b' : '#6b7280' }}>
                                                {performance?.atWork ?? 0}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center', fontSize: '14px', color: performance?.averageTime ? (performance.averageTime < 24 ? '#16a34a' : performance.averageTime < 72 ? '#f59e0b' : '#dc2626') : '#6b7280', fontWeight: 500 }}>
                                                {performance?.averageTime ? performance.averageTime.toFixed(1) : '—'}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                {performance?.avgSatisfaction ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                        <span style={{
                                                            fontSize: '14px',
                                                            fontWeight: 600,
                                                            color: performance.avgSatisfaction >= 4 ? '#16a34a' : performance.avgSatisfaction >= 3 ? '#f59e0b' : '#dc2626'
                                                        }}>
                                                            {performance.avgSatisfaction.toFixed(1)}
                                                        </span>
                                                        <span style={{ fontSize: '16px' }}>
                                                            {performance.avgSatisfaction >= 4 ? '⭐' : performance.avgSatisfaction >= 3 ? '🌟' : '⚠️'}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '14px', color: '#6b7280' }}>—</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                {performance?.status ? (
                                                    <span style={{
                                                        padding: '4px 12px',
                                                        borderRadius: '9999px',
                                                        fontSize: '12px',
                                                        fontWeight: 500,
                                                        background: performance.status === 'Active' ? '#dcfce7' : performance.status === 'Busy' ? '#fef3c7' : '#fee2e2',
                                                        color: performance.status === 'Active' ? '#166534' : performance.status === 'Busy' ? '#92400e' : '#991b1b'
                                                    }}>
                                                        {performance.status === 'Active' ? '🟢 Активен' : performance.status === 'Busy' ? '🟡 Занят' : '🔴 Не активен'}
                                                    </span>
                                                ) : '—'}
                                            </td>
                                            <td style={{ padding: '16px', textAlign: 'center' }}>
                                                <button
                                                    onClick={() => handleDeleteClick(admin.userId, admin.fullName)}
                                                    style={{
                                                        padding: '8px 16px',
                                                        background: '#fee2e2',
                                                        color: '#dc2626',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '13px',
                                                        fontWeight: 500,
                                                        transition: 'background 0.2s'
                                                    }}
                                                    onMouseOver={(e) => e.currentTarget.style.background = '#fecaca'}
                                                    onMouseOut={(e) => e.currentTarget.style.background = '#fee2e2'}
                                                >
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}            
            {/* REGION_ADMINISTRATOR */}
            <div style={{ padding: '20px', background: '#dbeafe', borderRadius: '12px', border: '1px solid #93c5fd' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#1e40af' }}>
                    🏛️ Добавить администратора области
                </h3>
                <p style={{ fontSize: '13px', color: '#1e40af', marginBottom: '16px', opacity: 0.8 }}>
                    REGION_ADMINISTRATOR — отвечает за область (без города и типов тикетов)
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                            ID пользователя *
                        </label>
                        <input 
                            type="number"
                            value={regionAdminUserId} 
                            onChange={(e) => setRegionAdminUserId(e.target.value)}
                            placeholder="Например: 5"
                            style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%', boxSizing: 'border-box', fontSize: '14px' }}
                        />
                    </div>
                    
                    <select 
                        value={regionAdminRegionId} 
                        onChange={(e) => setRegionAdminRegionId(e.target.value)}
                        style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px' }}
                    >
                        <option value="">Выберите область *</option>
                        {regions.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                    
                    <button 
                        onClick={handleAddRegionAdministrator}
                        style={{
                            padding: '12px 24px',
                            background: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '14px',
                            transition: 'background 0.2s',
                            alignSelf: 'flex-start'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
                    >
                        Назначить администратора области
                    </button>
                </div>
            </div>

            {/* CITY_ADMINISTRATOR */}
            <div style={{ padding: '20px', background: '#dcfce7', borderRadius: '12px', border: '1px solid #86efac' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#166534' }}>
                    🏙️ Добавить администратора города
                </h3>
                <p style={{ fontSize: '13px', color: '#166534', marginBottom: '16px', opacity: 0.8 }}>
                    CITY_ADMINISTRATOR — отвечает за город (без типов тикетов)
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                            ID пользователя *
                        </label>
                        <input 
                            type="number"
                            value={cityAdminUserId} 
                            onChange={(e) => setCityAdminUserId(e.target.value)}
                            placeholder="Например: 5"
                            style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%', boxSizing: 'border-box', fontSize: '14px' }}
                        />
                    </div>
                    
                    <select 
                        value={cityAdminRegionId} 
                        onChange={(e) => {
                            setCityAdminRegionId(e.target.value);
                            setCityAdminCityId('');
                        }}
                        style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px' }}
                    >
                        <option value="">Выберите область *</option>
                        {regions.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                    
                    <select 
                        value={cityAdminCityId} 
                        onChange={(e) => setCityAdminCityId(e.target.value)}
                        disabled={!cityAdminRegionId || cities.length === 0}
                        style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            fontSize: '14px',
                            opacity: (!cityAdminRegionId || cities.length === 0) ? 0.5 : 1
                        }}
                    >
                        <option value="">Выберите город *</option>
                        {cities.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    
                    <button 
                        onClick={handleAddCityAdministrator}
                        style={{
                            padding: '12px 24px',
                            background: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '14px',
                            transition: 'background 0.2s',
                            alignSelf: 'flex-start'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#15803d'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#16a34a'}
                    >
                        Назначить администратора города
                    </button>
                </div>
            </div>

            {/* SUPPORT */}
            <div style={{ padding: '20px', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fcd34d' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#92400e' }}>
                    🎧 Добавить поддержку
                </h3>
                <p style={{ fontSize: '13px', color: '#92400e', marginBottom: '16px', opacity: 0.8 }}>
                    SUPPORT — отвечает за конкретные типы тикетов в городе
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                            ID пользователя *
                        </label>
                        <input 
                            type="number"
                            value={supportUserId} 
                            onChange={(e) => setSupportUserId(e.target.value)}
                            placeholder="Например: 5"
                            style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', width: '100%', boxSizing: 'border-box', fontSize: '14px' }}
                        />
                    </div>
                    
                    <select 
                        value={supportRegionId} 
                        onChange={(e) => {
                            setSupportRegionId(e.target.value);
                            setSupportCityId('');
                        }}
                        style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '14px' }}
                    >
                        <option value="">Выберите область *</option>
                        {regions.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                    
                    <select 
                        value={supportCityId} 
                        onChange={(e) => setSupportCityId(e.target.value)}
                        disabled={!supportRegionId || cities.length === 0}
                        style={{
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            fontSize: '14px',
                            opacity: (!supportRegionId || cities.length === 0) ? 0.5 : 1
                        }}
                    >
                        <option value="">Выберите город *</option>
                        {cities.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500, color: '#374151' }}>
                            Типы тикетов * (выберите минимум один)
                        </label>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '12px',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            padding: '12px',
                            background: 'white',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            position: 'relative'
                        }}>
                            {ticketTypes.map(type => (
                                <label key={type.code} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    transition: 'background 0.2s',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#f9fafb';
                                    setHoveredType(type.code);
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    setHoveredType(null);
                                }}
                                >
                                    <input 
                                        type="checkbox"
                                        checked={supportTypes.includes(type.title)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSupportTypes([...supportTypes, type.title]);
                                            } else {
                                                setSupportTypes(supportTypes.filter(t => t !== type.title));
                                            }
                                        }}
                                        style={{ width: '16px', height: '16px', flexShrink: 0, cursor: 'pointer' }}
                                    />
                                    <span style={{ fontWeight: 500, color: '#1f2937', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {type.title}
                                    </span>
                                </label>
                            ))}
                            
                            {/* Tooltip с описанием */}
                            {hoveredType && (
                                <div style={{
                                    position: 'fixed',
                                    bottom: '20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#1f2937',
                                    color: 'white',
                                    padding: '12px 16px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    maxWidth: '400px',
                                    zIndex: 9999,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                                }}>
                                    <strong>{ticketTypes.find(t => t.code === hoveredType)?.title}</strong>
                                    <div style={{ marginTop: '4px', opacity: 0.9, lineHeight: 1.4 }}>
                                        {ticketTypes.find(t => t.code === hoveredType)?.description}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleAddSupport}
                        style={{
                            padding: '12px 24px',
                            background: '#d97706',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '14px',
                            transition: 'background 0.2s',
                            alignSelf: 'flex-start'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#b45309'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#d97706'}
                    >
                        Назначить поддержку
                    </button>
                </div>
            </div>

        </div>
    );
};

export default AdministratorManager;
