import * as React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {
  Hero,
  ModalSheet,
  StoreList,
  StoresMap,
  useStoreListRef,
} from '~/components';
import {Button, Icon, Text} from '~/components/core';
import type {Store} from '~/models/store';
import {getIkpStores} from '~/services/ikp-client';
import {theme} from '~/theme';
import type {Nullable} from '~/toolbox';

import {appStyles as styles} from './app.styles';

type SelectedStore = Nullable<{
  store: Store;
  index: number;
}>;

function App() {
  const [ikpStores, setIkpStores] = React.useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = React.useState<SelectedStore>(null);
  const storeListRef = useStoreListRef();

  React.useEffect(function () {
    async function getStores() {
      const {data: stores, error} = await getIkpStores();
      if (stores) {
        setIkpStores(stores);
      }
    }

    getStores();
  }, []);

  React.useEffect(
    function () {
      selectedStore
        ? storeListRef.current?.scrollToIndex(selectedStore.index)
        : storeListRef.current?.scrollToIndex(0);
    },
    [ikpStores, selectedStore, storeListRef],
  );

  function handleOnStoreSelect(store: Store, index: number) {
    setSelectedStore({store, index});
  }

  function handleOnStoreDeselect() {
    setSelectedStore(null);
  }

  function handleOnDismissModal() {
    setSelectedStore(null);
  }

  function handleOnPressTaskAssign(taskId: string) {
    console.log('Assign task id:', taskId);
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={styles.container.backgroundColor}
        />
        <StoresMap
          stores={ikpStores}
          onStoreSelect={handleOnStoreSelect}
          onStoreDeselect={handleOnStoreDeselect}
          style={styles.map}
        />
        <Hero text="IskayPet Challenge" style={styles.hero} />
        <StoreList
          ref={storeListRef}
          stores={ikpStores}
          style={styles.storeList}
        />
      </SafeAreaView>
      <ModalSheet
        visible={!!selectedStore}
        onDismiss={handleOnDismissModal}
        contentStyle={styles.modal}>
        <Text bold style={styles.storeHeader}>
          {selectedStore?.store.name}
        </Text>
        <View style={styles.storeDetail}>
          <Icon color={theme.colors.primary.blue} name="map-pin" size={16} />
          <Text style={styles.storeLabel}>
            {selectedStore?.store.address.direction}
          </Text>
        </View>
        <View style={styles.storeDetail}>
          <Icon color={theme.colors.primary.blue} name="clock" size={16} />
          <Text
            style={
              styles.storeLabel
            }>{`Open from ${selectedStore?.store.schedule.from} to ${selectedStore?.store.schedule.end}`}</Text>
        </View>
        <View style={styles.storeDetail}>
          <Icon color={theme.colors.primary.blue} name="key" size={16} />
          <Text style={styles.storeLabel}>
            {`Currently is ${selectedStore?.store.open ? 'OPEN' : 'CLOSED'}`}
          </Text>
        </View>
        <View style={styles.storeDetail}>
          <Icon color={theme.colors.primary.blue} name="truck" size={16} />
          <Text style={styles.storeLabel}>Shipping methods</Text>
        </View>
        {selectedStore?.store.shipping_methods.map((method, index) => (
          <View key={method.id} style={[styles.storeSubDetail, styles.indent]}>
            <Text>{`${index + 1}.`}</Text>
            <View style={styles.storeLabel}>
              <Text>{method.name}</Text>
              <Text variant="label">{method.description}</Text>
            </View>
          </View>
        ))}
        <View style={styles.storeDetail}>
          <Icon color={theme.colors.primary.blue} name="package" size={16} />
          <Text style={styles.storeLabel}>Tasks</Text>
        </View>
        {selectedStore?.store.tasks.map((task, index) => (
          <View key={task.id} style={[styles.storeSubDetail, styles.indent]}>
            <Text>{`${index + 1}.`}</Text>
            <View style={[styles.storeLabel, styles.task]}>
              <Text style={styles.taskDescription}>{task.description}</Text>
              <View style={styles.taskAssign}>
                {task.assigned ? (
                  <Text bold center variant="label" style={styles.taskAssigned}>
                    Assigned
                  </Text>
                ) : (
                  <Button
                    small
                    label="Assign"
                    onPress={() => handleOnPressTaskAssign(task.id)}
                  />
                )}
              </View>
            </View>
          </View>
        ))}
      </ModalSheet>
    </GestureHandlerRootView>
  );
}

export default App;
