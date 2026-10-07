import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, shadow, text } from '../theme';
import { Screen } from '../components/Screen';
import { BlueHeader, BottomNav } from '../components/Chrome';
import { Icon } from '../components/Icon';
import { useScale } from '../components/scale';
import { useApp } from '../state/AppContext';
import { SAVINGS_BASE, SAVINGS_BANNER, DISCOUNT_PER_VOUCHER, VOUCHERS } from '../data/menu';

/**
 * Screen 7 — "Savings"
 * Blue header, a 104px savings banner, four voucher rows with Apply pills, and
 * the "Your Savings" summary panel.
 *
 * The four §10 vouchers are seeded into SQLite by `initDB`; their applied flags
 * are hydrated from the `vouchers` table on boot and written back on every tap,
 * so the pills survive a restart. The panel runs upward from the $12.50 already
 * banked (§10) by $15 per applied voucher — the same rate the Order Details
 * summary credits as a discount.
 */
export function SavingsScreen() {
  const { state, dispatch } = useApp();
  const { px } = useScale();

  const savings = SAVINGS_BASE + state.appliedVouchers.length * DISCOUNT_PER_VOUCHER;

  return (
    <Screen background={color.surface} withStatusBar={false}>
      <BlueHeader title="Savings" />

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: px(18),
            paddingBottom: px(12),
            paddingHorizontal: px(20),
            gap: px(14),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner */}
        <View style={[styles.banner, { height: px(104), borderRadius: px(24), paddingHorizontal: px(18) }]}>
          <View style={[styles.bannerCopy, { gap: px(6), width: px(248) }]}>
            <Text style={[styles.bannerTitle, { fontSize: px(17), lineHeight: px(21) }]}>
              {SAVINGS_BANNER.title}
            </Text>
            <Text style={[styles.bannerDetail, { fontSize: px(10), lineHeight: px(14) }]}>
              {SAVINGS_BANNER.detail}
            </Text>
          </View>
          <View style={[styles.bannerIcon, { width: px(52), height: px(52) }]}>
            <Icon name="tag" size={px(25)} color={color.brand} />
          </View>
        </View>

        <Text style={[text.title, { color: color.brand, fontSize: px(18), lineHeight: px(22) }]}>
          Available Vouchers
        </Text>

        {/* Vouchers */}
        <View style={{ gap: px(9) }}>
          {VOUCHERS.map((voucher) => {
            const applied = state.appliedVouchers.includes(voucher.id);
            return (
              <View
                key={voucher.id}
                style={[styles.voucher, { height: px(76), borderRadius: px(18), paddingVertical: px(12), paddingHorizontal: px(12), gap: px(12) }]}
              >
                <View style={[styles.voucherChip, { width: px(42), height: px(42) }]}>
                  <Icon name={voucher.icon} size={px(19)} color={color.brand} />
                </View>

                <View style={[styles.voucherCopy, { gap: px(4), flex: 1 }]}>
                  <Text numberOfLines={1} style={[styles.voucherTitle, { fontSize: px(14), lineHeight: px(17) }]}>
                    {voucher.title}
                  </Text>
                  <Text numberOfLines={1} style={[styles.voucherMinimum, { fontSize: px(10), lineHeight: px(12) }]}>
                    {voucher.minimum}
                  </Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: applied }}
                  accessibilityLabel={`${applied ? 'Remove' : 'Apply'} ${voucher.title}`}
                  onPress={() => dispatch({ type: 'toggleVoucher', id: voucher.id })}
                  style={({ pressed }) => [
                    styles.apply,
                    {
                      width: px(60),
                      height: px(34),
                      borderRadius: px(17),
                      paddingHorizontal: px(15),
                      backgroundColor: applied ? color.brand : color.accent,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.applyText,
                      { fontSize: px(10), lineHeight: px(12) },
                    ]}
                  >
                    {applied ? 'Applied' : 'Apply'}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        {/* Savings total */}
        <View style={[styles.total, { height: px(92), borderRadius: px(18), paddingHorizontal: px(16), gap: px(13) }]}>
          <View style={[styles.totalIcon, { width: px(48), height: px(48) }]}>
            <Icon name="piggy-bank" size={px(24)} color={color.brand} />
          </View>
          <View style={[styles.totalCopy, { gap: px(5) }]}>
            <Text style={[styles.totalLabel, { fontSize: px(11), lineHeight: px(13) }]}>Your Savings</Text>
            <Text style={[styles.totalValue, { fontSize: px(18), lineHeight: px(22) }]}>
              {`Total Savings $${savings.toFixed(2)}`}
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav active="savings" onSelect={(key) => dispatch({ type: 'tab', tab: key })} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1 },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.brand,
    ...shadow.card,
  },
  bannerCopy: { justifyContent: 'center' },
  bannerTitle: { fontFamily: font.extraBold, color: color.surface },
  bannerDetail: { fontFamily: font.regular, color: color.surface, opacity: 0.78 },
  bannerIcon: {
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voucher: { flexDirection: 'row', alignItems: 'center', backgroundColor: color.surface },
  voucherChip: {
    borderRadius: radius.pill,
    backgroundColor: color.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voucherCopy: { justifyContent: 'center' },
  voucherTitle: { fontFamily: font.regular, color: color.brand },
  voucherMinimum: { fontFamily: font.regular, color: color.brand, opacity: 0.52 },
  apply: { alignItems: 'center', justifyContent: 'center' },
  applyText: { fontFamily: font.extraBold, color: color.surface },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.muted,
  },
  totalIcon: {
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalCopy: { justifyContent: 'center' },
  totalLabel: { fontFamily: font.semiBold, color: color.brand, opacity: 0.62 },
  totalValue: { fontFamily: font.regular, color: color.brand },
});
