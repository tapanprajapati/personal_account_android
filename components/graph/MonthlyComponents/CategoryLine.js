import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native';
import {Modal} from 'react-native';
import {processColor, View} from 'react-native';
import {LineChart} from 'react-native-charts-wrapper';
import {Icon} from 'react-native-elements';
import CategoryDBHandler from '../../../databasehandler/categoryhandler';
import EntryDBHandler from '../../../databasehandler/entryhandler';
import CategoryFilterModal from '../../../modals/CategoryFilterModal';
import {Graph} from '../../../styles/colors';
import {global} from '../../../styles/global';
import CategoryHorizontalBar from '../YearlyComponents/CategoryHorizontalBar';

export default class CategoryLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      months: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
      ],
      data: {},
      showCategoryModal: false,
    };

    this.categoryHandler = new CategoryDBHandler();
    this.entryHandler = new EntryDBHandler();
  }

  componentDidMount() {
    // GET CATEGORIES FROM TYPE props.type

    // this.setState({years: years})
    this.state.months.forEach((month) => {
      const monthYear = `${month}/${this.props.year}`;
      this.categoryHandler
        .getCategoryTotalByMonthYear(monthYear, this.props.type)
        .then((categories) => {
          let data = this.state.data;
          data[month] = categories;

          this.setState({data: data});

          this.setCategories(categories);
        });
    });
  }

  setCategories = (categories) => {
    categories.forEach((category) => {
      const found = this.state.categories.find(
        (c) => c.category.id == category.id,
      );

      if (!found) {
        const newCat = {
          category: {
            id: category.id,
            title: category.title,
          },
          status: true,
        };

        this.setState({
          categories: [...this.state.categories, newCat],
        });
      }
    });
  };

  getData = () => {
    let dataSets = [];

    this.state.categories.forEach((category) => {
      if (category.status) {
        let values = [];
        this.state.months.forEach((month) => {
          values.push({
            x: parseInt(month),
            y: this.getTotal(month, category.category.id),
          });
        });

        const c = processColor(Graph.random());

        dataSets.push({
          values: values,
          label: category.category.title,
          config: {
            valueTextSize: 10,
            color: c,
            circleColor: c,
          },
        });
      }
    });

    return {
      dataSets: dataSets,
    };
  };

  getTotal = (month, id) => {
    let total = 0;
    if (this.state.data[month] == undefined) return 0;
    this.state.data[month].forEach((category) => {
      // console.log(category)
      if (category.id == id) {
        total = category.total;
      }
    });

    return total;
  };

  saveCategories = (categories) => {
    this.setState({
      categories: categories,
    });
  };

  render() {
    return (
      <View style={[styles.chartContainer, global.shadow]}>
        <View style={styles.titleContainer}>
          <Text style={global.graphTitle}>{this.props.title}</Text>
          <Icon
            containerStyle={styles.filter}
            name="filter-outline"
            type="ionicon"
            raised
            color="#396884"
            reverse
            size={10}
            onPress={() => {
              this.setState({showCategoryModal: true});
            }}
          />
        </View>
        <LineChart
          style={{flex: 1}}
          data={this.getData()}
          // data={{
          // dataSets:[{config:{}}]
          // }}
          xAxis={{
            granularityEnabled: true,
            granularity: 1,
            position: 'BOTTOM',
            labelCount: 12,
            axisMinimum: 0,
            drawAxisLines: false,
            drawGridLines: false,
            labelRotationAngle: 90,
          }}
          yAxis={{
            right: {
              enabled: false,
            },
            left: {
              drawGridLines: false,
            },
          }}
          legend={{
            //   orientation: "VERTICAL",
            verticalAlignment: 'BOTTOM',
            horizontalAlignment: 'LEFT',
            wordWrapEnabled: true,
            form: 'CIRCLE',
          }}
          chartDescription={{
            text: '',
          }}
          animation={{
            durationX: 1500,
          }}
          marker={{
            enabled: true,
          }}
        />

        <CategoryHorizontalBar year={this.props.year} type={this.props.type} />

        <Modal
          transparent={true}
          visible={this.state.showCategoryModal}
          onRequestClose={() => this.setState({showCategoryModal: false})}>
          <CategoryFilterModal
            categories={this.state.categories}
            saveChanges={this.saveCategories}
            close={() => this.setState({showCategoryModal: false})}
          />
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  filter: {
    position: 'absolute',
    end: 0,
  },
  chartContainer: {
    flex: 1,
    height: 600,
    margin: 10,
    padding: 4,
    backgroundColor: 'white',
    borderRadius: 15,
  },
});
