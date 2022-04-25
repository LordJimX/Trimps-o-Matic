from decimal import Decimal
import copy
import matplotlib.pyplot as plt
import numpy as np
from scipy import interpolate

# Health becomes: [Base health] * 1.19^([level-1]*14 +1) or *11.4 per prestige level
# Attack becomes: [Base attack] * 1.19^([level-1]*13 +1) or *9.60 per prestige level

# Upgrade: [base cost] * 1.2^level
# When Shieldblock is activated, Block becomes: 1.5 * 1.19^([level-1]*10 +1) or *5.69 per prestige level
# [base cost] * 1.069^([level-1]*57 +1) at prestige < 4 (*44.8 per level)
# [base cost] * 1.069^([(level-3)*0.85+2]*57 +1) at prestige >= 4 (*25.3 per level).
# [Base cost] * (0.95^[Artisanistry level])

health = ['Shield', 'Boots', 'Helmet', 'Pants', 'Shouldergrds', 'Breastplate', 'Gambeson']
attack = ['Dagger', 'Mace', 'Polearm', 'Battleaxe', 'Greatsword', 'Arbalest']

arti_lvl = 11
with_Shield = False
with_last_eqpt = False

if not with_Shield:
    health = health[1:]

if not with_last_eqpt:
    health = health[:-1]
    attack = attack[:-1]

eqpt_lists = {'Health': health, 'Attack': attack}

base_cost = {
    'Shield': 40 * 0.95 ** arti_lvl,
    'Dagger': 40 * 0.95 ** arti_lvl,
    'Boots': 55 * 0.95 ** arti_lvl,
    'Mace': 80 * 0.95 ** arti_lvl,
    'Helmet': 100 * 0.95 ** arti_lvl,
    'Polearm': 140 * 0.95 ** arti_lvl,
    'Pants': 160 * 0.95 ** arti_lvl,
    'Battleaxe': 230 * 0.95 ** arti_lvl,
    'Shouldergrds': 275 * 0.95 ** arti_lvl,
    'Greatsword': 375 * 0.95 ** arti_lvl,
    'Breastplate': 415 * 0.95 ** arti_lvl,
    'Arbalest': 1 * 0.95 ** arti_lvl,
    'Gambeson': 1 * 0.95 ** arti_lvl
}

base_effect = {
    'Shield': 4,
    'Dagger': 2,
    'Boots': 6,
    'Mace': 3,
    'Helmet': 10,
    'Polearm': 4,
    'Pants': 14,
    'Battleaxe': 7,
    'Shouldergrds': 23,
    'Greatsword': 9,
    'Breastplate': 35,
    'Arbalest': 15,
    'Gambeson': 60
}

state = {
    # equipt: [prestige lvl, upgrade lvl,
    # effet for 1 upgde lvl, next upgrade cost, next upgrade cost / effect
    # next prestige effect, next prestige cost, next prestige cost / effect]'
    'Shield':       [6, 1, 0, 0, 0, 0, 0, 0],
    'Dagger':       [6, 1, 0, 0, 0, 0, 0, 0],
    'Boots':        [6, 1, 0, 0, 0, 0, 0, 0],
    'Mace':         [6, 1, 0, 0, 0, 0, 0, 0],
    'Helmet':       [6, 1, 0, 0, 0, 0, 0, 0],
    'Polearm':      [6, 1, 0, 0, 0, 0, 0, 0],
    'Pants':        [6, 1, 0, 0, 0, 0, 0, 0],
    'Battleaxe':    [6, 1, 0, 0, 0, 0, 0, 0],
    'Shouldergrds': [6, 1, 0, 0, 0, 0, 0, 0],
    'Greatsword':   [6, 1, 0, 0, 0, 0, 0, 0],
    'Breastplate':  [6, 1, 0, 0, 0, 0, 0, 0],
    'Arbalest':     [6, 1, 0, 0, 0, 0, 0, 0],
    'Gambeson':     [6, 1, 0, 0, 0, 0, 0, 0],
    'Attack': 0,
    'Health': 0
}


def update_state(s):
    s['Health'] = 0
    s['Attack'] = 0
    for eqpt in attack + health:
        # effet
        if eqpt in health:
            s[eqpt][2] = base_effect[eqpt] * 1.19 ** ((s[eqpt][0] - 1) * 14 + 1)
        elif eqpt in attack:
            s[eqpt][2] = base_effect[eqpt] * 1.19 ** ((s[eqpt][0] - 1) * 13 + 1)
        else:
            print('Equipment not found for effect calculation')
        # next lvl cost
        if s[eqpt][0] < 4:
            s[eqpt][3] = base_cost[eqpt] * 1.069 ** ((s[eqpt][0] - 1) * 57 + 1) * 1.2 ** s[eqpt][1]
        else:
            s[eqpt][3] = base_cost[eqpt] * 1.069 ** (((s[eqpt][0] - 3) * 0.85 + 2) * 57 + 1) * 1.2 ** s[eqpt][1]
        # next level cost / effect
        s[eqpt][4] = s[eqpt][3] / s[eqpt][2]
        # next prestige effect
        if eqpt in health:
            s[eqpt][5] = base_effect[eqpt] * 1.19 ** ((s[eqpt][0] + 1 - 1) * 14 + 1)
        elif eqpt in attack:
            s[eqpt][5] = base_effect[eqpt] * 1.19 ** ((s[eqpt][0] + 1 - 1) * 13 + 1)
        else:
            print('Equipment not found for effect calculation')
        # next prestige cost
        if s[eqpt][0] < 3:
            s[eqpt][6] = base_cost[eqpt] * 1.069 ** ((s[eqpt][0] + 1 - 1) * 57 + 1)
        else:
            s[eqpt][6] = base_cost[eqpt] * 1.069 ** (((s[eqpt][0] + 1 - 3) * 0.85 + 2) * 57 + 1)
        # next prestige cost / effect
        s[eqpt][7] = s[eqpt][6] / s[eqpt][5]
        # health & attack
        if eqpt in health:
            s['Health'] += s[eqpt][2] * s[eqpt][1]
        if eqpt in attack:
            s['Attack'] += s[eqpt][2] * s[eqpt][1]


def print_state(s):

    def pad(txt, n):
        return txt + ' ' * (n - len(txt)) * (len(txt) < n)

    txt = ''
    txt += '|--------------|-------|-------|---------------------------------|---------------------------------|\n'
    txt += '|              |       |       |      Current prestige level     |       Next prestige level       |\n'
    txt += '| Equipment    | Prstg | Level |  Effect  | Next lvl | Cst/effct |  Effect  |   Cost   | Cst/effct |\n'
    txt += '|--------------|-------|-------|----------|----------|-----------|----------|----------|-----------|\n'
    separator = False
    for eqpt in attack + health:
        if not separator and eqpt in health:
            separator = True
            txt += '|--------------|-------|-------|----------|----------|-----------|----------|----------|-----------|\n'
        txt += pad('| ' + eqpt + ' ', 15)
        txt += pad('|  %d ' % s[eqpt][0], 8)
        txt += pad('|  %d ' % s[eqpt][1], 8)
        txt += '| %.2E ' % Decimal(s[eqpt][2])
        txt += '| %.2E ' % Decimal(s[eqpt][3])
        txt += '| %.2E  ' % Decimal(s[eqpt][4])
        txt += '| %.2E ' % Decimal(s[eqpt][5])
        txt += '| %.2E ' % Decimal(s[eqpt][6])
        txt += '| %.2E  |\n' % Decimal(s[eqpt][7])
    txt += '|--------------|-------|-------|----------|----------|-----------|----------|----------|-----------|\n'
    txt += 'Attack = %.2e\n' % Decimal(s['Attack'])
    txt += 'Health = %.2e' % Decimal(s['Health'])
    print(txt)


def compute_investment(s, eqpt_type, metal_max):

    eqpt_list = eqpt_lists[eqpt_type]

    # buy best cost / effect
    def get_next_invest(s):
        # return eqpt to invest on, and if it is prestige or level
        best_cost_per_effect = 1e999
        best_eqpt = ''
        invest_prstg = False  # False = lvl, True = prestige
        for eqpt in eqpt_list:
            if s[eqpt][4] < best_cost_per_effect:
                best_eqpt = eqpt
                best_cost_per_effect = s[eqpt][4]
                invest_prstg = False
            if s[eqpt][7] < best_cost_per_effect:
                best_eqpt = eqpt
                best_cost_per_effect = s[eqpt][7]
                invest_prstg = True
        return (best_eqpt, invest_prstg)

    metal = [1e10]
    effects = [s[eqpt_type]]
    states = [s]
    equipments = []
    prestiges = []
    while metal[-1] < metal_max:
        next_s = copy.deepcopy(states[-1])
        next_invest = get_next_invest(states[-1])
        best_eqpt = next_invest[0]
        metal += [metal[-1]]
        effects += [effects[-1]]
        equipments += [best_eqpt]
        prestiges += [next_invest[1]]
        if next_invest[1]:
            metal[-1] += states[-1][best_eqpt][6]
            effects[-1] -= states[-1][best_eqpt][1] * states[-1][best_eqpt][2]
            effects[-1] += states[-1][best_eqpt][5]
            next_s[best_eqpt][0] += 1
            next_s[best_eqpt][1] = 1
        else:
            metal[-1] += states[-1][best_eqpt][3]
            effects[-1] += states[-1][best_eqpt][2]
            next_s[best_eqpt][1] += 1
        update_state(next_s)
        states += [next_s]

    # buy last eqpt prestige
    metal2 = [1e10]
    effects2 = [s[eqpt_type]]
    states2 = [s]
    equipments2 = []
    prestiges2 = []
    while metal2[-1] < metal_max:
        next_s = copy.deepcopy(states2[-1])
        next_eqpt = eqpt_list[0]
        for i, eqpt in enumerate(eqpt_list[1:]):
            if states2[-1][eqpt][0] < states2[-1][eqpt_list[i]][0]:
                next_eqpt = eqpt_list[i + 1]
        metal2 += [metal2[-1] + states2[-1][next_eqpt][6]]
        effects2 += [effects2[-1] + states2[-1][next_eqpt][5]]
        equipments2 += [next_eqpt]
        prestiges2 += [True]
        next_s[next_eqpt][0] += 1
        next_s[next_eqpt][1] = 1
        update_state(next_s)
        states2 += [next_s]
    # print_state(states[-1])
    # print_state(states2[-1])

    fig1 = plt.figure()
    ax1 = fig1.add_subplot(1, 1, 1)
    f = interpolate.interp1d(np.array(metal2), np.array(effects2), kind='previous', fill_value="extrapolate")
    y = f(np.array(metal))
    plt.step(np.array(metal), np.array(effects), c='blue', lw=1, ls='-', marker='None', label='', where='post')
    plt.step(np.array(metal2), np.array(effects2), c='red', lw=1, ls='-', marker='None', label='', where='post')
    ax1.set_xscale('log')
    ax1.set_yscale('log')
    plt.xlabel(r'metal', fontsize='x-large')
    plt.ylabel(r'effect', fontsize='x-large')
    # plt.xlim(0, 1)
    # plt.ylim(0, 1)
    # plt.grid(True)
    plt.xticks(size='large')
    plt.yticks(size='large')
    # plt.legend(loc='upper right', labelspacing=.5, fontsize=9)
    plt.tight_layout()

    fig2 = plt.figure()
    f = interpolate.interp1d(np.array(metal2), np.array(effects2), kind='previous', fill_value="extrapolate")
    y = f(np.array(metal))
    plt.semilogx(np.array(metal), np.divide(np.array(effects) - y, y), c='blue', lw=1, ls='-', marker='None', label='')
    plt.xlabel(r'metal', fontsize='x-large')
    plt.ylabel(r'effect', fontsize='x-large')
    # plt.xlim(0, 1)
    # plt.ylim(0, 1)
    # plt.grid(True)
    plt.xticks(size='large')
    plt.yticks(size='large')
    # plt.legend(loc='upper right', labelspacing=.5, fontsize=9)
    plt.tight_layout()

    plt.show()


update_state(state)
print_state(state)
compute_investment(state, 'Attack', 1E14)
