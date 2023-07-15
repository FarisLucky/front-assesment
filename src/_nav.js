export default [
  {
    component: 'CNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
  },
  {
    component: 'CNavTitle',
    name: 'Theme',
  },
  {
    component: 'CNavItem',
    name: 'Karyawan',
    to: '/karyawans',
    icon: 'cil-file',
  },
  {
    component: 'CNavGroup',
    name: 'Data Master',
    icon: 'cil-puzzle',
    items: [
      {
        component: 'CNavItem',
        name: 'Jabatan',
        to: '/jabatans',
      },
    //   {
    //     component: 'CNavItem',
    //     name: 'Unit',
    //     to: '/units',
    //   },
      {
        component: 'CNavItem',
        name: 'Penilaians',
        to: '/m-penilaians',
      },
      {
        component: 'CNavItem',
        name: 'Sub Penilaian',
        to: '/m-sub-penilaians',
      },
      {
        component: 'CNavItem',
        name: 'Sub Item',
        to: '/m-valid-penilai',
      },
      {
        component: 'CNavItem',
        name: 'Tipe',
        to: '/tipe',
      },
    ]
  },
  {
    component: 'CNavItem',
    name: 'Penilaians',
    to: '/penilaian-karyawans',
    icon: 'cil-pencil',
  },
  {
    component: 'CNavItem',
    name: 'History Penilaians',
    to: '/history-penilaians',
    icon: 'cil-notes',
  },
]
