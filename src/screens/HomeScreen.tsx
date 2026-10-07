import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { color, font, radius, shadow, text } from '../theme';
import { Screen } from '../components/Screen';
import { BottomNav } from '../components/Chrome';
import { Icon } from '../components/Icon';
import { useScale } from '../components/scale';
import { useApp, useNavigate } from '../state/AppContext';
import { LOCATION, MENU, PROMO, assets } from '../data/menu';

/**
 * Screen 2 — "Home / Popular Menu"
 * White canvas: delivery header, search field, blue promo banner with a circular
 * salad photo, then five 66px menu rows.
 */
export function HomeScreen() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const { cartCount } = useApp();
  const { px } = useScale();

  return (
    <Screen background={color.surface}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: px(8),
            paddingBottom: px(10),
            paddingHorizontal: px(20),
            gap: px(12),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery header — location chip on the left, cart on the right. */}
        <View style={styles.deliveryRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change delivery location"
            style={styles.location}
          >
            <View style={[styles.locationChip, { width: px(38), height: px(38) }]}>
              <Icon name="map-pin" size={px(19)} color={color.brand} />
            </View>
            <View style={styles.locationCopy}>
              <Text style={[styles.locationLabel, { fontSize: px(10), lineHeight: px(12) }]}>
                {LOCATION.label}
              </Text>
              <Text style={[styles.locationValue, { fontSize: px(14), lineHeight: px(17) }]}>
                {LOCATION.value}
              </Text>
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Cart, ${cartCount} items`}
            onPress={() => navigate({ name: 'orders' })}
            style={[styles.cartButton, { width: px(40), height: px(40) }]}
          >
            <Icon name="shopping-cart" size={px(20)} color={color.brand} />
            {cartCount > 0 ? (
              <View style={[styles.cartBadge, { width: px(17), height: px(17), borderRadius: px(9) }]}>
                <Text style={[styles.cartBadgeText, { fontSize: px(9), lineHeight: px(11) }]}>
                  {cartCount > 9 ? '9+' : cartCount}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        {/* Search */}
        <Pressable
          accessibilityRole="search"
          accessibilityLabel="Search for food, drinks, or cuisines"
          style={[
            styles.search,
            { height: px(46), borderRadius: px(14), paddingHorizontal: px(14), gap: px(9) },
          ]}
        >
          <Icon name="search" size={px(18)} color={color.brand} />
          <Text style={[styles.searchText, { fontSize: px(11), lineHeight: px(13) }]}>
            Search for food, drinks, or cuisines
          </Text>
        </Pressable>

        {/* Promo banner — copy on the left, circular photo bleeding off the right. */}
        <View
          style={[
            styles.promo,
            {
              height: px(128),
              borderRadius: px(24),
              paddingLeft: px(18),
              paddingRight: px(10),
              paddingVertical: px(14),
            },
          ]}
        >
          <View style={[styles.promoCopy, { gap: px(7), width: px(244) }]}>
            <Text style={[styles.promoTitle, { fontSize: px(18), lineHeight: px(21) }]}>
              {PROMO.title}
            </Text>
            <Text style={[styles.promoDetail, { fontSize: px(10), lineHeight: px(12) }]}>
              {PROMO.detail}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Browse the offer"
              onPress={() => navigate({ name: 'orders' })}
              style={[styles.promoAction, { width: px(28), height: px(28) }]}
            >
              <Icon name="arrow-right" size={px(15)} color={color.brand} />
            </Pressable>
          </View>
          <Image
            source={assets.promoSalad}
            style={{ width: px(116), height: px(116), borderRadius: px(58) }}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        </View>

        {/* Section heading */}
        <View style={styles.sectionRow}>
          <Text style={[text.title, { color: color.brand, fontSize: px(18), lineHeight: px(22) }]}>
            Popular Menu
          </Text>
          <Pressable accessibilityRole="button" accessibilityLabel="See all menu items">
            <Text style={[styles.seeAll, { fontSize: px(11), lineHeight: px(13) }]}>See All</Text>
          </Pressable>
        </View>

        {/* Five menu rows */}
        <View style={{ gap: px(3) }}>
          {MENU.map((dish) => (
            <Pressable
              key={dish.id}
              accessibilityRole="button"
              accessibilityLabel={`${dish.name}, $${dish.price}`}
              onPress={() => {
                dispatch({ type: 'qty', value: 1 });
                navigate({ name: 'orderDetails', dishId: dish.id });
              }}
              style={({ pressed }) => [
                styles.menuItem,
                { height: px(66), gap: px(12), paddingTop: px(2), opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Image
                source={dish.image}
                style={{
                  width: px(58),
                  height: px(58),
                  borderRadius: px(14),
                  backgroundColor: color.muted,
                }}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />
              <View style={[styles.menuCopy, { gap: px(4) }]}>
                <Text numberOfLines={1} style={[styles.menuName, { fontSize: px(13), lineHeight: px(16) }]}>
                  {dish.name}
                </Text>
                <Text numberOfLines={1} style={[styles.menuNote, { fontSize: px(10), lineHeight: px(12) }]}>
                  {dish.note}
                </Text>
              </View>
              <Text style={[styles.menuPrice, { fontSize: px(14), lineHeight: px(17) }]}>
                ${dish.price}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Add ${dish.name} to cart`}
                hitSlop={8}
                onPress={() => dispatch({ type: 'cartAdd', dishId: dish.id })}
                style={({ pressed }) => [
                  styles.menuAdd,
                  {
                    width: px(28),
                    height: px(28),
                    borderRadius: px(14),
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <Icon name="plus" size={px(15)} color={color.surface} />
              </Pressable>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <BottomNav active="home" onSelect={(key) => dispatch({ type: 'tab', tab: key })} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1 },
  deliveryRow: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  location: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  locationChip: {
    borderRadius: radius.pill,
    backgroundColor: color.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationCopy: { justifyContent: 'center', gap: 3 },
  locationLabel: {
    fontFamily: font.medium,
    color: color.brand,
    opacity: 0.55,
  },
  locationValue: { fontFamily: font.regular, color: color.brand },
  cartButton: {
    borderRadius: radius.pill,
    backgroundColor: color.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: { fontFamily: font.extraBold, color: color.surface },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.canvas,
  },
  searchText: { fontFamily: font.regular, color: color.brand, opacity: 0.5 },
  promo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.brand,
    overflow: 'hidden',
    ...shadow.card,
  },
  promoCopy: { justifyContent: 'center' },
  promoTitle: { fontFamily: font.extraBold, color: color.surface },
  promoDetail: { fontFamily: font.regular, color: color.surface, opacity: 0.78 },
  promoAction: {
    borderRadius: radius.pill,
    backgroundColor: color.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  sectionRow: {
    height: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seeAll: { fontFamily: font.bold, color: color.brand },
  menuItem: { flexDirection: 'row', alignItems: 'center' },
  menuCopy: { flex: 1, justifyContent: 'center' },
  menuName: { fontFamily: font.regular, color: color.brand },
  menuNote: { fontFamily: font.regular, color: color.brand, opacity: 0.52 },
  menuPrice: { fontFamily: font.extraBold, color: color.accent },
  menuAdd: {
    backgroundColor: color.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
